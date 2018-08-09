import React, { Component } from 'react';
import { Container, Header, Icon, Divider, Grid, List, Form, Button } from 'semantic-ui-react'
import YoutubePlayer from 'react-youtube-player';
import './App.css';

class IdList extends Component {
  render() {
    const listIds = this.props.ids.map((id) =>
      <List.Item key={id.toString()}>{id}</List.Item>
    )

    return (
      <List>{listIds}</List>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props)

    this.ids = JSON.parse(localStorage.getItem('played_ids')) || []
    this.state = {videoId: this.ids[0]}

    this.videoId = ''
    this.historyMax = 10

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  onEnd(event) {
    event.target.seekTo(0, true)
    event.target.playVideo()
  }

  handleChange(event) {
    this.videoId = event.target.value
  }

  handleSubmit(event) {
    this.setState({videoId: this.videoId})
    this.updateHistory(this.videoId)
    event.preventDefault()
  }

  updateHistory(id) {
    if (this.ids.includes(id)) {
      return
    }

    if (this.ids.length >= this.historyMax) {
      this.ids.pop()
    }

    this.ids.unshift(id)
    localStorage.setItem('played_ids', JSON.stringify(this.ids))
  }

  render() {
    return (
      <Container>
        <Header as='h2' icon textAlign='center' color='teal'>
          <Icon name='play' />
          <Header.Content>YouTube Repeater</Header.Content>
        </Header>
        <Divider hidden section />
        <Form onSubmit={this.handleSubmit} >
          <Form.Field>
            <input placeholder='video ID' onChange={this.handleChange} required='true' />
          </Form.Field>
          <Button type='submit' >Play</Button>
        </Form>
        <Divider hidden section />
        <Grid>
          <Grid.Column width={12}>
            <div className='ui embed'>
              {this.state.videoId &&
                <YoutubePlayer
                  videoId={this.state.videoId}
                  playbackState='playing'
                  onEnd={this.onEnd}
                  configuration={
                    {
                      autoplay: 1,
                      showinfo: 0
                    }
                  }
                />
              }
            </div>
          </Grid.Column>
          <Grid.Column width={3}>
            <IdList ids={this.ids} />
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

export default App;
