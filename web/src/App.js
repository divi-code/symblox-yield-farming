import React, {Component} from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles";
import {Switch, Route, Redirect} from "react-router-dom";
import IpfsRouter from "ipfs-react-router";

import "./i18n";
import {IntlProvider} from "react-intl";
import en_US from "./language/en_US";
import zh_CN from "./language/zh_CN";
import interestTheme from "./theme";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./components/home";
import Page404 from "./components/Page404";

class App extends Component {
    state = {
        account: null,
        headerValue: null,
        cur_language: navigator.language === "zh-CN" ? "中文" : "EN"
    };

    setHeaderValue = newValue => {
        this.setState({headerValue: newValue});
    };
    setLanguage = event => {
        this.setState({cur_language: event.target.value});
    };

    render() {
        return (
            <IntlProvider
                locale={"en"}
                messages={this.state.cur_language === "中文" ? zh_CN : en_US}
            >
                <MuiThemeProvider theme={createMuiTheme(interestTheme)}>
                    <CssBaseline />
                    <IpfsRouter>
                        <ScrollToTop>
                            <Switch>
                                <Route exact path="/">
                                    <Home
                                        cur_language={this.state.cur_language}
                                        setLanguage={this.setLanguage}
                                    />
                                </Route>
                                <Route path="/404">
                                    <Page404 />
                                </Route>
                                <Route path="*">
                                    <Page404 />
                                </Route>
                            </Switch>
                        </ScrollToTop>
                    </IpfsRouter>
                </MuiThemeProvider>
            </IntlProvider>
        );
    }
}

export default App;
