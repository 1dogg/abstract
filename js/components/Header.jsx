var React = require('react');
import { TopBar, Gapped } from '@skbkontur/react-ui';
import Button from '@material-ui/core/Button'
import logo from '../../content/img/logo.svg';

let helperStyle = {
    display: "inline-block",
    height: "100%",
    verticalAlign: "middle"
}

let imgStyle = {
    width: "95px",
    height: "31px",
    verticalAlign: "middle"
};

let navStyle = {
    display: "flex",
    alignItems: "center"
};

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = { pathname: "" };
    }

    componentDidMount(prevProps, prevState) {
        var path = window.location.pathname;
        this.setState({ pathname: path });
    }

    redirectToListPage() {
        window.location.href = '/';
    }

    redirectToAddPage() {
        window.location.href = '/add';
    }

    render() {
        return (
                <TopBar>
                    <TopBar.Start>
                        <TopBar.ItemStatic>
                            <span style={helperStyle} />
                            <img xlinkHref={logo}
                                src={logo}
                                alt="Artsofte"
                                style={imgStyle} />                 
                        </TopBar.ItemStatic>
                    </TopBar.Start>
                    <div style={navStyle}>
                        <Gapped>
                        <Button variant="contained" color="secondary"
                            size="small"
                            disabled={this.state.pathname == "/"}
                            onClick={this.redirectToListPage}>
                            Список сотрудников
                        </Button>
                        <Button variant="contained" color="primary"
                            size="small"
                            disabled={this.state.pathname == "/add"}
                            onClick={this.redirectToAddPage}>
                            Добавить
                        </Button>
                        </Gapped>
                    </div>
                </TopBar>
        );
    }
}

export default Header;