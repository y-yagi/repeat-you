import React, { Component } from 'react';
import { Container, Header, Icon, Divider, Grid, List, Form, Button } from 'semantic-ui-react'
import YoutubePlayer from 'react-youtube-player';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {videoId: null}

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.videoId = ''
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
    event.preventDefault()
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
            <List>
            </List>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

export default App;
