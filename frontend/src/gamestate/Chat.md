# ChatPopup Component

## Overview

The `ChatPopup` component is a React-based chat interface for Multiplayer Dominoes that allows users to send and
view messages in a small popup window. It can be easily integrated into the web application for quick communication
or messaging features.

## Features

- **Chat Window**: Displays a list of messages that are sent.
- **Message Input**: Allows users to type messages into an input field.
- **Send Button**: Sends the typed message when clicked.
- **Responsive Design**: The popup is styled to be responsive and nice to look at.

## Key Components

### 1. **State Management**
The component uses the `useState` hook to manage two pieces of state:
- **`messages`**: A list that stores chat messages.
- **`input`**: A string to manage the content of the input field.

### 2. **Handle Send**
- **`handleSend`**: This function is triggered when the user clicks the "Send" button. It checks if the input field is not empty, adds the message to the `messages` array, and clears the input field.

### 3. **Styling**
The component uses **JSS** for inline styling, which includes:
- **Popup Window**: Positioned fixed at the bottom right of the screen, with a border radius and background color.
- **Message Box**: A scrollable container for the chat messages with padding and background styling.
- **Input Field**: A styled text input with padding, border, and font customization.
- **Send Button**: A styled button for sending messages, with a custom background color and cursor pointer.

### 4. **Custom Font**
The component uses the `"Press Start 2P"` font, which gives the popup a nice, retro, arcade-like feel! The font is
applied to both the messages and input fields.

## Usage

### Example:

```js
import React from 'react';
import ChatPopup from './ChatPopup';

const App = () => {
  const handleClose = () => { // Prop function made for the example. Not currently implemented in the code.
    console.log("Chat popup closed");
  };

  return (
    <div>
      <h1>Welcome to the Chat</h1>
      <ChatPopup onClose={handleClose} />
    </div>
  );
};

export default App;
