import {forwardRef} from 'react';
// import './styles.css';

export const StyledApp = {
  Container: ({ children }) => (
    <div className="container">{children}</div>
  ),
  Form: ({ children, ...props }) => (
    <form className="form" {...props}>
      {children}
    </form>
  ),
  HistoryWrapper: forwardRef(({ children, ...props },ref) => (
    <ul className="history-wrapper" ref={ref} {...props}>
      {children}
    </ul>
  )),
  NoHistory: ({ children }) => <div className='no-history'>{children}</div>,
  ChatItem: ({ children, me }) => <li className={`${me ? '' : ''}`}>{children}</li>,
  ChatName: ({ children }) => <strong className="chat-name">{children}</strong>,
  ChatMessage: ({ children }) => <p className="chat-message">{children}</p>,
  NameInput: ({ children, ...props }) => (
    <input className="name-input" {...props} />
  ),
  MessageInput: (props) => (
    <input className="message-input" {...props} autoComplete='off'/>
  ),
  SubmitButton: ({ children, ...props }) => (
    <button className="submit-button" type="submit">
      {children}
    </button>
  ),
};