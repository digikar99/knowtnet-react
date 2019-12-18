import React from 'react';
import InfoPanelWithoutAbout from './InfoPanelWithoutAbout';

function InfoPanel(props) {
    if (props.aboutPage == "null")
        return (
            <InfoPanelWithoutAbout id={props.id}
                                   updateSelectedTheme={props.updateSelectedTheme}
                                   updateSelectedTheme={props.updateSelectedTheme}
                                   toggleKnown={props.toggleKnown}
                                   known={props.known}
                                   toggleMenu={props.toggleMenu}
                                   menuIsOpen={props.menuIsOpen}
                                   />
        );
    else return (
        <div />
    );
}

export default InfoPanel;
