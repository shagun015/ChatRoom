import { useState, useRef, useCallback, useEffect } from 'react';
import { useStateWithCallback } from './useStateWithCallback';
import { socketInit } from '../socket';
import { ACTIONS } from '../actions';
import freeice from 'freeice';

export const useWebRTC = (roomId, user) => {
    const [clients, setClients] = useStateWithCallback([]);
    const audioElements = useRef({});
    const connections = useRef({});
    const localMediaStream = useRef(null);
    const socket = useRef(null);
    const clientsRef = useRef([]);


    const addNewClient = useCallback(
        (newClient, cb) => {
            const lookingFor = clients.find(
                (client) => client.id === newClient.id
            );

            if (lookingFor === undefined) {
                setClients(
                    (existingClients) => [...existingClients, newClient],
                    cb
                );
            }
        },
        [clients, setClients]
    );

    useEffect(() => {
        socket.current = socketInit();
    }, []);

    

    //Handle Join and leave
    useEffect(() => {
        const startCapture = async () => {
            localMediaStream.current =
                await navigator.mediaDevices.getUserMedia({
                    audio: true,
                });
        };

        startCapture().then(() => {
            addNewClient({...user,muted: true}, () => {
                const localElement = audioElements.current[user.id];
                if (localElement) {
                    localElement.volume = 0;
                    localElement.srcObject = localMediaStream.current;
                }

                // socket emit JOIN socket io
                socket.current.emit(ACTIONS.JOIN, { roomId, user });
            });
        });

        return () => {
            // Leaving the room
            if (localMediaStream.current && localMediaStream.current.getTracks) {
              localMediaStream.current.getTracks().forEach((track) => {
                track.stop();
              });
            }

            socket.current.emit(ACTIONS.LEAVE, { roomId });
        };
    }, []);
    //Handle Join and leave end!



    // Handle new peer
    useEffect(() => {
        const handleNewPeer = async ({
            peerId,
            createOffer,
            user: remoteUser,
        }) => {
            // if already connected then give warning
            if (peerId in connections.current) {
                return console.warn(
                    `You are already connected with ${peerId} (${user.name})`
                );
            }

            connections.current[peerId] = new RTCPeerConnection({
                iceServers: freeice(),
            });

            // Handle new ice candidate
            connections.current[peerId].onicecandidate = (event) => {
                socket.current.emit(ACTIONS.RELAY_ICE, {
                    peerId,
                    icecandidate: event.candidate,
                });
            };

            // Handle on track on this connection

            connections.current[peerId].ontrack = ({
                streams: [remoteStream],
            }) => {
                addNewClient({...remoteUser,muted:true}, () => {
                    if (audioElements.current[remoteUser.id]) {
                        audioElements.current[remoteUser.id].srcObject =
                            remoteStream;
                    } else {
                        let settled = false;
                        const interval = setInterval(() => {
                            if (audioElements.current[remoteUser.id]) {
                                audioElements.current[remoteUser.id].srcObject =
                                    remoteStream;
                                settled = true;
                            }
                            if (settled) {
                                clearInterval(interval);
                            }
                        }, 1000);
                    }
                });
            };

            // Add local track to remote connections
            localMediaStream.current.getTracks().forEach((track) => {
                connections.current[peerId].addTrack(
                    track,
                    localMediaStream.current
                );
            });

            // Create offer
            if (createOffer) {
                const offer = await connections.current[peerId].createOffer();

                await connections.current[peerId].setLocalDescription(offer);

                // send offer to another client
                socket.current.emit(ACTIONS.RELAY_SDP, {
                    peerId,
                    sessionDescription: offer,
                });
            }
        };

        socket.current.on(ACTIONS.ADD_PEER, handleNewPeer);

        return () => {
            socket.current.off(ACTIONS.ADD_PEER);
        };
    }, []);
    // Handle new peer end!



    // Handle ice candidate
    useEffect(() => {
        socket.current.on(ACTIONS.ICE_CANDIDATE, ({ peerId, icecandidate }) => {
            if (icecandidate) {
                connections.current[peerId].addIceCandidate(icecandidate);
            }
        });

        return () => {
            socket.current.off(ACTIONS.ICE_CANDIDATE);
        };
    }, []);
    // Handle ice candidate end!



    // Handle SDP
    useEffect(() => {
        const handleRemoteSdp = async ({
            peerId,
            sessionDescription: remoteSessionDescription,
        }) => {
            connections.current[peerId].setRemoteDescription(
                new RTCSessionDescription(remoteSessionDescription)
            );

            // if session description is type of offer then create an answer

            if (remoteSessionDescription.type === 'offer') {
                const connection = connections.current[peerId];
                const answer = await connection.createAnswer();

                connection.setLocalDescription(answer);

                socket.current.emit(ACTIONS.RELAY_SDP, {
                    peerId,
                    sessionDescription: answer,
                });
            }
        };
        socket.current.on(ACTIONS.SESSION_DESCRIPTION, handleRemoteSdp);

        return () => {
            socket.current.off(ACTIONS.SESSION_DESCRIPTION);
        };
    }, []);
    // Handle SDP end!

    

    // Handle remove peer
    useEffect(() => {
        const handleRemovePeer = async ({ peerId, userId }) => {
            if (connections.current[peerId]) {
                connections.current[peerId].close();
            }

            delete connections.current[peerId];
            delete audioElements.current[peerId];
            setClients((list) => list.filter((client) => client.id !== userId));
        };

        socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);

        return () => {
            socket.current.off(ACTIONS.REMOVE_PEER);
        };
    }, []);
    // Handle remove peer end!


    
    useEffect(() => {
      clientsRef.current = clients;
    }, [clients])
    


    //listen for mute/unmute
    useEffect(() => {
        
        const setMute = (mute, userId) => {
            
            const connectedClients = JSON.parse(JSON.stringify(clientsRef.current));  
        
            // Find the client index by userId
            const clientIdx = connectedClients.findIndex((client) => client.id === userId);
        
            if (clientIdx > -1) {
                // Update the muted property of the specific client
                connectedClients[clientIdx].muted = mute;
        
                // Update the state with the modified array
                setClients([...connectedClients]);
            }
        };
        
        socket.current.on(ACTIONS.MUTE,({peerId,userId})=>{
            setMute(true,userId)
        });

        socket.current.on(ACTIONS.UN_MUTE,({peerId,userId})=>{
            setMute(false,userId)
        });

        return () => {
            socket.current.off(ACTIONS.MUTE);
            socket.current.off(ACTIONS.UN_MUTE);
        }
    }, [])
    //listen for mute/unmute end!
   



    const provideRef = (instance, userId) => {
        audioElements.current[userId] = instance;
    };

    const handleMute = (isMute,userId)=>{
        let settled = false;
        if (userId === user.id) {
            let interval = setInterval(()=>{
                if(localMediaStream.current){
                    localMediaStream.current.getTracks()[0].enabled = !isMute;
                    if(isMute){
                        socket.current.emit(ACTIONS.MUTE,{
                            roomId,
                            userId: user.id
                        })
                    }
                    else{
                        socket.current.emit(ACTIONS.UN_MUTE,{
                            roomId,
                            userId: user.id
                        })
                    }
                    settled=true;
                }
                if(settled){
                    clearInterval(interval);
                }
            },200) 
        }    
    };
    
    return { clients, provideRef,handleMute };
};