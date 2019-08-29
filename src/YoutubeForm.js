import React from 'react';
import './YoutubeForm.css';

class YoutubeForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {inputValue: ''};
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    handleChange(e){
        this.setState({inputValue: e.target.value})
    }
    handleSubmit(e){
        this.props.search(this.state.inputValue);
        this.setState({inputValue: ''});
    }
    render() {
        return(
            <div className="form-container">
                <input 
                    type="text" 
                    value={this.state.inputValue}
                    onChange={this.handleChange}
                />
                <button 
                    onClick={this.handleSubmit}
                >
                Search
                </button>
            </div>
        )
    }
}

export default YoutubeForm;