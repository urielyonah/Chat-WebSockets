import React from 'react'
import { useState, useEffect  } from 'react'
import io from 'socket.io-client'
import { Box, TextField, Button, List, ListItem, ListItemText, Paper, Grid } from '@mui/material';

const socket = io('/')

export const Chat = () => {

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (input.trim() !== '') {
          const newMessage = {
            body: input,
            from: 'Me'
          };
          setMessages([...messages, newMessage]);
          socket.emit('message', input);
          setInput('');
        }
      };
    
    useEffect(() => {
        const receiveMessage = (message) => {
            setMessages((state) => [...state, message]);
        }

        socket.on('message', receiveMessage)
        return () => {
          socket.off('message', receiveMessage)
        }
    }, [])

    return (
        <Grid
            display="flex"
            direction="column"
            container
            justifyContent="center"
            alignItems="center"
            style={{ height: '100vh'}}
        >
            <Grid item xs={12} sm={8} md={6}>
                <Box 
                    id="chat" 
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        height: '80%',
                        maxHeight: '80vh',
                        p: 2,
                        backgroundColor: 'background.paper',
                        boxShadow: 3,
                        textAlign: "center",
                        justifyContent: 'space-between'  // Asegura que los elementos internos estén correctamente distribuidos
                    }}
                >
                    <Paper sx={{ flex: 1, mb: 2, overflow: 'auto', p: 2 }}>
                        <List>
                            {messages.map((message, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={`${message.from}: ${message.body}`} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                    <Box sx={{ display: 'flex' }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    handleSend();
                                }
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
}


