import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, List, ListItem, ListItemText, Paper, Grid } from '@mui/material';
import io from 'socket.io-client';

const socket = io('https://chatwebsockets-qoek.onrender.com');

export const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const handleSend = () => {
        if (input.trim() !== '') {
            const newMessage = {
                body: input,
                from: 'Me',
                type: 'sent' // Marcar el tipo de mensaje como enviado
            };
            setMessages([...messages, newMessage]);
            socket.emit('message', input);
            setInput('');
            scrollToBottom(); // Enfocar el último mensaje después de enviar uno nuevo
        }
    };

    useEffect(() => {
        const receiveMessage = (message) => {
            setMessages((state) => [...state, { ...message, type: 'received' }]); // Marcar el tipo de mensaje como recibido
            scrollToBottom(); // Enfocar el último mensaje después de recibir uno nuevo
        };

        socket.on('message', receiveMessage);
        return () => {
            socket.off('message', receiveMessage);
        };
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <Grid
            display="flex"
            direction="column"
            container
            justifyContent="center"
            alignItems="center"
            style={{ height: '100vh' }}
        >
            <Grid item xs={12} sm={8} md={6}>
                <Box
                    id="chat"
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '400px', 
                        height: '400px',
                        p: 2,
                        backgroundColor: 'background.paper',
                        boxShadow: 3,
                        textAlign: 'center',
                        justifyContent: 'space-between' // Asegura que los elementos internos estén correctamente distribuidos
                    }}
                >
                    <Paper sx={{ flex: 1, mb: 2, overflow: 'auto', p: 2 }}>
                        <List>
                            {messages.map((message, index) => (
                                <ListItem
                                    key={index}
                                    sx={{
                                        alignSelf: message.type === 'sent' ? 'flex-end' : 'flex-start', // Alinea los mensajes enviados hacia la derecha y los recibidos hacia la izquierda
                                        backgroundColor: message.type === 'sent' ? 'green' : 'blue', // Cambia el color de fondo dependiendo del tipo de mensaje
                                        borderRadius: '10px', // Agrega bordes redondeados
                                        maxWidth: '70%', // Limita el ancho del mensaje
                                        marginBottom: '5px', // Agrega margen inferior
                                        marginLeft: message.type === 'sent' ? 'auto' : 'unset', // Alinea el mensaje enviado hacia la derecha
                                        marginRight: message.type === 'sent' ? 'unset' : 'auto', // Alinea el mensaje recibido hacia la izquierda
                                        color: 'white', // Cambia el color del texto a blanco
                                        wordWrap: 'break-word', // Permite que los mensajes sean de varias líneas
                                        whiteSpace: 'pre-wrap' // Ajusta el texto para que envuelva correctamente en varias líneas
                                    }}
                                >
                                    <ListItemText primary={`${message.from}: ${message.body}`} />
                                </ListItem>
                            ))}
                            <div ref={messagesEndRef} /> {/* Referencia para el último elemento */}
                        </List>
                    </Paper>
                    <Box sx={{ display: 'flex', marginBottom: '10px' }}>
                        {/* Agregamos un margen inferior adicional al TextField */}
                        <TextField
                            fullWidth
                            multiline // Permitimos que el TextField sea de varias líneas
                            variant="outlined"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleSend();
                                }
                            }}
                            sx={{
                                marginBottom: '10px', // Agregamos el margen inferior adicional aquí
                                maxWidth: 'calc(100% - 80px)', // Establecer un ancho máximo para el TextField, dejando espacio para el botón de enviar
                                flexGrow: 1 // Hacer que el TextField crezca para ocupar el espacio disponible
                            }}
                        />
                        <Button variant="contained" color="primary" onClick={handleSend}>
                            Send
                        </Button>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    );
};


