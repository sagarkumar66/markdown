import { useState, useEffect } from 'react'
import ReactMarkDown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import './App.css'

export default function App() {
  const [input, setInput] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');

  function callAPI(dataToSend) {
    fetch('http://localhost:3000/getMarkdownString', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify(dataToSend), 
    })
    .then(res => res.json())
    .then(res => { 
      res.data ? setDebouncedValue(res.data) : setDebouncedValue(''); 
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  }  

  useEffect(() => {
    const timer = setTimeout(() => {
      callAPI({data: input});
    }, 1000);

    return () => clearTimeout(timer);
  }, [input]);

  return (
    <div className='app'>
      <textarea className='textarea' value={input} onChange={(e) => setInput(e.target.value)} autoFocus></textarea>
      <ReactMarkDown children={debouncedValue} className='markdown' components={{
      code(props) {
        const {children, className, node, ...rest} = props
        const match = /language-(\w+)/.exec(className || '')
        return match ? (
          <SyntaxHighlighter
            {...rest}
            PreTag="div"
            children={String(children).replace(/\n$/, '')}
            language={match[1]}
            style={darcula}
          />
        ) : (
          <code {...rest} className={className}>
            {children}
          </code>
        )
      }
    }} />
    </div>
  )
}
