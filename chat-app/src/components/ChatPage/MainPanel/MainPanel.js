import React, { Component } from "react";
import MessageHeader from "./MessageHeader";
import Message from "./Message";
import MessageForm from "./MessageForm";
import { connect } from "react-redux";
import firebase from "../../../firebase";

export class MainPanel extends Component {
  state = {
    messages: [],
    messagesRef: firebase.database().ref("messages"),
    messagesLoading: true,
    // 부모 컴포넌트에서 state, trigger 함수 정의
    searchTerm: "",
    searchResults: [],
    searchLoading: false,
  };

  handleSearchMessages = () => {
    const chatRoomMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTerm, "gi");
    const searchResults = chatRoomMessages.reduce((acc, message) => {
      if (
        // Text 메시지 또는 유저로만 찾기
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
      ) {
        acc.push(message);
      }
      return acc;
    }, []);

    this.setState({ searchResults });
    setTimeout(() => this.setState({ searchLoading: false }), 1000);
  };

  handleSearchChange = (event) => {
    this.setState(
      {
        searchTerm: event.target.value,
        searchLoading: true,
      },
      () => this.handleSearchMessages()
    );
  };

  componentDidMount() {
    const { chatRoom } = this.props;
    if (chatRoom) {
      this.addMessagesListeners(chatRoom.id);
    }
  }

  addMessagesListeners = (chatRoomId) => {
    let messagesArray = [];
    this.setState({ messages: [] });
    this.state.messagesRef
      .child(chatRoomId)
      .on("child_added", (DataSnapshot) => {
        messagesArray.push(DataSnapshot.val());
        this.setState({
          messages: messagesArray,
          messagesLoading: false,
        });
      });
  };

  renderMessages = (messages) =>
    messages.length > 0 &&
    messages.map((message) => (
      <Message
        key={message.timestamp}
        message={message}
        user={this.props.user}
      />
    ));

  render() {
    const { messages, searchTerm, searchResults } = this.state;
    return (
      <div style={{ padding: "2rem 2rem 0 2rem" }}>
        {/* 자식 컴포넌트에게 trigger 함수 전달 */}
        <MessageHeader handleSearchChange={this.handleSearchChange} />

        <div
          style={{
            width: "100%",
            height: "450px",
            border: ".2rem solid #ececec",
            borderRadius: "4px",
            padding: "1rem",
            marginBottom: "1rem",
            overflowY: "auto",
          }}
        >
          {searchTerm
            ? this.renderMessages(searchResults)
            : this.renderMessages(messages)}
        </div>

        <MessageForm />
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    user: state.user.currentUser,
    chatRoom: state.chatRoom.currentChatRoom,
  };
};
export default connect(mapStateToProps)(MainPanel);
