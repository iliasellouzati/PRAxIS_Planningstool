import React from 'react';


export default class ContextMenu extends React.Component {
    state = {
        xPos: "0px",
        yPos: "0px",
        showMenu: this.props.showMenu
    }

    componentDidMount() {
        document.addEventListener("click", this.handleClick);
        document.addEventListener("contextmenu", this.handleContextMenu);
    }

    componentWillUnmount() {
        document.removeEventListener("click", this.handleClick);
        document.removeEventListener("contextmenu", this.handleContextMenu);
    }

    handleClick = (e) => {
        if (this.state.showMenu) this.setState({ showMenu: false });
    }

    handleContextMenu = (e) => {
        e.preventDefault();

        this.setState({
            xPos: `${e.pageX}px`,
            yPos: `${e.pageY}px`,
            showMenu: true,
        });
    }


    render() {
        const { showMenu, xPos, yPos } = this.state;

        if (showMenu)
            return (
                <div
                    className="menu"
                    id="context-menu"
                    style={{
                        top: yPos,
                        left: xPos,
                    }}
                >
                    <div className="option-0618">06u-18u</div>
                    <div className="option-0719">07u-19u</div>
                    <div className="option-1806">18u-06u</div>
                    <div className="option-1907">19u-07u</div>
                </div>
            );
        else return null;
    }
}
