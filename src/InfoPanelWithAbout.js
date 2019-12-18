import React from 'react';
var serverData = require('./serverData.json');

// FilterForm.updateSelectedtheme is to be updated

class SiteTitle extends React.Component{
    render() {
        const self=this;
        return (
            <span>
              <div id="site-title" className="text-center">
                <span id="site-title-text">KnowTNet</span>              
              </div>
              <p className="text-center">
                <a href={serverData["front-page"]}>Go Back</a>
              </p>
            </span>
        );   
    }
}
class InfoPanelWithAbout extends React.Component {
    render(props){
        return (
            <div id={this.props.id}>
              <SiteTitle/>
            </div>
        );   
    }
}

export default InfoPanelWithAbout;
