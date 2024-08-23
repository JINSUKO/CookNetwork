import {forwardRef} from 'react';

import ChatDesign from '../assets/styles/ChatMessage.module.css';

export const StyledApp = {
    Container : ({ children }) => (<div className="container">{children}</div>),
    Form : ({ children, ...props }) => (
        <form className="form" {...props}>
            {children}
        </form>
    ),
    HistoryWrapper : forwardRef(({ children, ...props },ref) => (
        <ul className="history-wrapper" ref={ref} {...props}>
            {children}
        </ul>
    )),
    NoHistory : ({ children }) => <div className='no-history'>{children}</div>,
    ChatItem : ({ children, me, chatDesign }) => <li className={me ? ChatDesign.me : ChatDesign.other}>{children}</li>,
    ChatName : ({ children }) => <strong className="chat-name">{children}</strong>,
    ChatMessage : ({ children }) => <p className="chat-message">{children}</p>,
    NameInput : ({ children }) => <strong className="name-input">{children}</strong>,
    MessageInput : (props) => (
        <input className="message-input" {...props} autoComplete='off'/>
    ),
    SubmitButton : ({ children, ...props }) => (
        <button className="submit-button" type="submit">
            {children}
        </button>
    ),
};