import React from 'react';
import InfoPanelWithoutAbout from './InfoPanelWithoutAbout';
import InfoPanelWithAbout from './InfoPanelWithAbout';

function InfoPanel(props) {
    if (props.aboutPage == null) return (
        <InfoPanelWithoutAbout id={props.id}
                               updateSelectedTheme={props.updateSelectedTheme}
                               updateSelectedTheme={props.updateSelectedTheme}
                               toggleKnown={props.toggleKnown}
                               known={props.known}
                               toggleMenu={props.toggleMenu}
                               menuIsOpen={props.menuIsOpen}
                               clearKnownLinks={props.clearKnownLinks}
                               />
    );
    else return (
        <InfoPanelWithAbout id={props.id}/>
    );
}

export default InfoPanel;
