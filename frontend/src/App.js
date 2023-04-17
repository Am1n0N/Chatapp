import React, { useRef, useState, useEffect } from 'react';
import './App.css';
const User = require('./models/User');
const io = require('socket.io-client');

function App() {

  const [user] = useState(null);

  function SignOut() {
    return user && (
      <button>Sign Out</button>
    );
  }

  return (
    <div className="App">
      <header>
        <h1>⚛️🔥💬</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );


  function SignupForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [interests, setInterests] = useState('');
    const [preferences, setPreferences] = useState('');

    const handleSubmit = (event) => {
      //save user to mongoDB using mongoose
      const user = new User({
        username,
        password,
        age,
        gender,
        interests,
        preferences,
      });
      user.save();

    };
    return (
      <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <br />
        <label>
          Age:
          <input type="number" value={age} onChange={(event) => setAge(event.target.value)} />
        </label>
        <br />
        <label>
          Gender:
          <select value={gender} onChange={(event) => setGender(event.target.value)}>
            <option value="">Select gender...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label>
        <br />
        <label>
          Interests:
          <textarea value={interests} onChange={(event) => setInterests(event.target.value)} />
        </label>
        <br />
        <label>
          Preferences:
        </label>
        <label>
          Age Range:
          <input type="number" value={preferences.ageRange.min} onChange={(event) => setPreferences(event.target.value)} />
          <input type="number" value={preferences.ageRange.max} onChange={(event) => setPreferences(event.target.value)} />
        </label>
        <label>
          gender:
          <select value={gender} onChange={(event) => setGender(event.target.value)}>
            <option value="">Select gender...</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </label>
        <br />
        <button type="submit">Sign Up</button>
      </form>
    );
  }

  function SignIn() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (event) => {
      event.preventDefault();
    };

    return (
      <form className='sign-in' onSubmit={handleSubmit}>
        <label>
          Username:
          <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} />
        </label>
        <br />
        <label>
          Password:
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <br />
        <button type="submit">Sign In</button>
      </form>
    );
  }

  function ChatRoom() {
    const dummy = useRef();
    const [messages, setMessages] = useState([]);
    const socket = io("ws://localhost:8080");

    useEffect(() => {
      socket.emit('getMessages');

      socket.on('messages', (data) => {
        setMessages(data);
        dummy.current.scrollIntoView({ behavior: 'smooth' });
      });
    }, [socket]);

    const [formValue, setFormValue] = useState('');

    const sendMessage = (e) => {
      e.preventDefault();

      const { uid, photoURL } = user;

      socket.emit('sendMessage', {
        text: formValue,
        createdAt: new Date(),
        uid,
        photoURL,
      });

      setFormValue('');
      dummy.current.scrollIntoView({ behavior: 'smooth' });
    };

    return (
      <main>
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        <span ref={dummy}></span>

        <form className='form' onSubmit={sendMessage}>
          <input
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            placeholder="say something nice"
          />
          <button type="submit" disabled={!formValue}>
            🕊️
          </button>
        </form>
      </main>
    );
  }
  function ChatMessage(props) {
    const { text, uid, photoURL } = props.message;

    const messageClass = uid === user.uid ? 'sent' : 'received';

    return (<>
      <div className={`message ${messageClass}`}>
        <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
        <p>{text}</p>
      </div>
    </>)

  }
}

export default App;
