import React, {Component} from "react";
import {FormattedMessage} from "react-intl";
import {withStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Dialog from "@material-ui/core/Dialog";
import Divider from "@material-ui/core/Divider";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

import Store from "../../stores";
import {
    TRADE,
    CALCULATE_PRICE,
    CALCULATE_PRICE_RETURNED
} from "../../constants";

const emitter = Store.emitter;
const dispatcher = Store.dispatcher;

const styles = theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
        fontFamily: "Noto Sans SC",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "28px",
        lineHeight: "39px",
        textAlign: "center",
        color: "#1E304B"
    },
    button: {
        background:
            "linear-gradient(135deg, #42D9FE 0%, #2872FA 100%, #42D9FE)",
        borderRadius: "26px",
        fontFamily: "Noto Sans SC",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "20px",
        lineHeight: "34px",
        color: "#FFFFFF",
        minWidth: "115px",
        height: "60px",
        margin: "16px 8px 32px 8px",
        "&:hover": {
            background:
                "linear-gradient(315deg, #4DB5FF 0%, #57E2FF 100%, #4DB5FF)"
        }
    },
    containedButton: {
        borderRadius: "6px",
        margin: "0 6px"
    },
    select: {
        borderRadius: "6px"
    },
    closeButton: {
        position: "absolute",
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500]
    },
    formControl: {
        margin: 0,
        minWidth: 120
    },
    formContent: {
        margin: "16px 0px",
        display: "flex"
    },
    textField: {
        flex: 1
    },
    text: {
        fontFamily: "Noto Sans SC",
        fontStyle: "normal",
        fontWeight: "300",
        fontSize: "18px",
        lineHeight: "25px",
        color: "#ACAEBC"
    },
    rightText: {
        float: "right",
        fontFamily: "Noto Sans SC",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "18px",
        lineHeight: "22px",
        textAlign: "right",
        color: "#4E5B70"
    },
    textPrimy: {
        fontWeight: 500,
        color: "#4E5B70"
    }
});

const DialogTitle = withStyles(styles)(props => {
    const {children, classes, onClose, ...other} = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
            {onClose ? (
                <IconButton
                    aria-label="close"
                    className={classes.closeButton}
                    onClick={onClose}
                >
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const DialogContent = withStyles(theme => ({
    root: {
        padding: theme.spacing(2),
        fontFamily: "Noto Sans SC",
        fontStyle: "normal",
        fontWeight: "300",
        fontSize: "18px",
        lineHeight: "25px",
        color: "#ACAEBC"
    }
}))(MuiDialogContent);

const DialogActions = withStyles(theme => ({
    root: {
        margin: 0,
        padding: theme.spacing(1)
    }
}))(MuiDialogActions);

class TransactionModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tokens: props.data.tokens,
            token: props.data.tokens[0],
            amount: "0",
            price: props.data.price,
            buyToken: props.data.tokens[1],
            buyAmount: "0"
        };
    }

    componentWillMount() {
        emitter.on(CALCULATE_PRICE_RETURNED, this.setPrice.bind(this));
    }

    componentWillUnmount() {
        emitter.removeListener(
            CALCULATE_PRICE_RETURNED,
            this.setPrice.bind(this)
        );
    }

    setPrice(data) {
        this.setState({
            price: data.price
        });
        if (data.type == "sell") {
            this.setState({
                buyAmount: (
                    parseFloat(data.amount) * parseFloat(data.price)
                ).toFixed(4)
            });
        } else if (data.type == "buyIn") {
            this.setState({
                amount: (
                    (parseFloat(data.amount) * 1) /
                    parseFloat(data.price)
                ).toFixed(4)
            });
        }
    }

    handleChange = event => {
        const token = event.target.name;
        this.setState({
            [token]: event.target.value,
            buyToken:
                this.state.tokens[0] == event.target.value
                    ? this.state.tokens[this.state.tokens.length - 1]
                    : this.state.tokens[0],
            amount: 0.0,
            buyAmount: 0.0,
            price: this.props.data.price
        });
    };

    buyHandleChange = event => {
        const token = event.target.name;
        this.setState({
            [token]: event.target.value,
            token:
                this.state.tokens[0] == event.target.value
                    ? this.state.tokens[this.state.tokens.length - 1]
                    : this.state.tokens[0],
            amount: 0.0,
            buyAmount: 0.0,
            price: this.props.data.price
        });
    };

    amountChange = event => {
        if (parseFloat(event.target.value) > 0) {
            this.setState({
                amount: event.target.value
            });
            this.getPrice("sell", parseFloat(event.target.value));
        } else {
            this.setState({
                amount: event.target.value,
                buyAmount: isNaN(
                    parseFloat(event.target.value) *
                        parseFloat(this.props.data.price)
                )
                    ? 0.0
                    : parseFloat(event.target.value) *
                      parseFloat(this.props.data.price).toFixed(4)
            });
            this.getPrice();
        }
    };

    buyAmountChange = event => {
        if (parseFloat(event.target.value) > 0) {
            this.setState({
                buyAmount: event.target.value
            });
            this.getPrice("buyIn", parseFloat(event.target.value));
        } else {
            this.setState({
                amount: isNaN(
                    (parseFloat(event.target.value) * 1) /
                        parseFloat(this.props.data.price)
                )
                    ? 0.0
                    : (
                          (parseFloat(event.target.value) * 1) /
                          parseFloat(this.props.data.price)
                      ).toFixed(4),
                buyAmount: event.target.value
            });
            this.getPrice();
        }
    };

    max = () => {
        const pool = this.props.data;
        const token = this.state.token;
        const formatNumberPrecision = this.formatNumberPrecision;

        let maxAmount =
            token == "SYX"
                ? parseFloat(pool.maxSyxIn) > parseFloat(pool.rewardsBalance)
                    ? formatNumberPrecision(pool.rewardsBalance)
                    : formatNumberPrecision(pool.maxSyxIn)
                : parseFloat(pool.maxErc20In) > parseFloat(pool.erc20Balance)
                ? formatNumberPrecision(pool.erc20Balance)
                : formatNumberPrecision(pool.maxErc20In);

        if (parseFloat(maxAmount) > 0) {
            this.setState({
                amount: maxAmount + ""
            });
            this.getPrice("sell", maxAmount);
        } else {
            this.setState({
                amount: maxAmount + "",
                buyAmount: (maxAmount * this.props.data.price).toFixed(6)
            });

            this.getPrice();
        }
    };

    getPrice = (type, amount) => {
        if (type) {
            dispatcher.dispatch({
                type: CALCULATE_PRICE,
                content: {
                    asset: this.props.data,
                    amount,
                    type,
                    tokenIn:
                        this.state.token == "SYX"
                            ? this.props.data.rewardsAddress
                            : this.props.data.erc20Address,
                    tokenOut:
                        this.state.buyToken == "SYX"
                            ? this.props.data.rewardsAddress
                            : this.props.data.erc20Address
                }
            });
        } else {
            const price = this.props.data.price;
            if (this.state.token == "SYX") {
                this.setState({price: parseFloat(parseFloat(price))});
            } else {
                this.setState({price: parseFloat(1 / parseFloat(price))});
            }
        }
    };

    formatNumberPrecision = (data, decimals = 6) => {
        return Math.floor(parseFloat(data) * 10 ** decimals) / 10 ** decimals;
    };

    formatNumber = (amount, decimals, decimalPlace = decimals) => {
        let roundAmount = amount.replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
        let index = roundAmount.indexOf(".");
        return roundAmount.slice(0, index - 1 + decimalPlace);
    };

    confirm = () => {
        dispatcher.dispatch({
            type: TRADE,
            content: {
                asset: this.props.data,
                amount: this.formatNumber(this.state.amount, 18, 6),
                price:
                    this.state.token == "SYX"
                        ? (1 / parseFloat(this.state.price)) * 1.1
                        : parseFloat(this.state.price) * 1.1,
                token:
                    this.state.token == "SYX"
                        ? this.props.data.rewardsAddress
                        : this.props.data.erc20Address,
                token2:
                    this.state.buyToken == "SYX"
                        ? this.props.data.rewardsAddress
                        : this.props.data.erc20Address
            }
        });

        this.props.closeModal();
    };

    render() {
        const {classes, type, data, closeModal, modalOpen} = this.props;
        const fullScreen = window.innerWidth < 450;

        return (
            <Dialog
                onClose={closeModal}
                aria-labelledby="customized-dialog-title"
                open={modalOpen}
                fullWidth={true}
                fullScreen={fullScreen}
            >
                <DialogTitle id="customized-dialog-title" onClose={closeModal}>
                    <FormattedMessage id="POPUP_TITLE_SWAP" />
                </DialogTitle>
                <DialogContent>
                    <Typography gutterBottom align="right">
                        <span style={{float: "left"}}>
                            <FormattedMessage id="POPUP_LABEL_FROM" />
                        </span>
                        <span className={classes.textPrimy}>
                            <FormattedMessage id="POPUP_WALLET_BALANCE" />
                            {": "}
                            {this.state.token == data.tokens[0]
                                ? parseFloat(data.maxSyxIn) >
                                  parseFloat(data.rewardsBalance)
                                    ? parseFloat(data.rewardsBalance).toFixed(4)
                                    : parseFloat(data.maxSyxIn).toFixed(4) +
                                      data.tokens[0]
                                : parseFloat(data.maxErc20In) >
                                  parseFloat(data.erc20Balance)
                                ? parseFloat(data.erc20Balance).toFixed(4)
                                : parseFloat(data.maxErc20In).toFixed(4) +
                                  data.tokens[1]}
                        </span>
                    </Typography>
                    <div className={classes.formContent}>
                        <TextField
                            className={classes.textField}
                            value={this.state.amount}
                            onChange={this.amountChange}
                            id="outlined-basic"
                            label={<FormattedMessage id="POPUP_INPUT_AMOUNT" />}
                            variant="outlined"
                        />
                        <Button
                            className={classes.containedButton}
                            variant="contained"
                            onClick={this.max}
                        >
                            <FormattedMessage id="POPUP_INPUT_MAX" />
                        </Button>
                        <FormControl
                            variant="outlined"
                            className={classes.formControl}
                        >
                            <InputLabel htmlFor="age-native-simple">
                                <FormattedMessage id="POPUP_INPUT_TOKEN" />
                            </InputLabel>
                            <Select
                                className={classes.select}
                                value={this.state.token}
                                onChange={this.handleChange.bind(this)}
                                label="Token"
                                inputProps={{
                                    name: "token",
                                    id: "outlined-token"
                                }}
                            >
                                {this.state.tokens.map(v => (
                                    <option value={v}>{v}</option>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <Typography gutterBottom align="right">
                        <span style={{float: "left"}}>
                            <FormattedMessage id="POPUP_LABEL_TO" />
                        </span>{" "}
                        <span className={classes.textPrimy}>
                            <FormattedMessage id="POPUP_WALLET_BALANCE" />
                            {": "}
                            {this.state.token == data.tokens[1]
                                ? parseFloat(data.maxSyxIn) >
                                  parseFloat(data.rewardsBalance)
                                    ? parseFloat(data.rewardsBalance).toFixed(4)
                                    : parseFloat(data.maxSyxIn).toFixed(4) +
                                      data.tokens[0]
                                : parseFloat(data.maxErc20In) >
                                  parseFloat(data.erc20Balance)
                                ? parseFloat(data.erc20Balance).toFixed(4)
                                : parseFloat(data.maxErc20In).toFixed(4) +
                                  data.tokens[1]}
                        </span>
                    </Typography>
                    <div className={classes.formContent}>
                        <TextField
                            className={classes.textField}
                            value={this.state.buyAmount}
                            onChange={this.buyAmountChange}
                            id="outlined-basic"
                            label={<FormattedMessage id="POPUP_INPUT_AMOUNT" />}
                            variant="outlined"
                        />
                        <FormControl
                            variant="outlined"
                            className={classes.formControl}
                        >
                            <InputLabel htmlFor="age-native-simple">
                                <FormattedMessage id="POPUP_INPUT_TOKEN" />
                            </InputLabel>
                            <Select
                                className={classes.select}
                                value={this.state.buyToken}
                                onChange={this.buyHandleChange.bind(this)}
                                label="Token"
                                inputProps={{
                                    name: "buyToken",
                                    id: "outlined-token"
                                }}
                            >
                                {this.state.tokens.map(v => (
                                    <option value={v}>{v}</option>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <Typography gutterBottom>
                        <span className={classes.text}>
                            <FormattedMessage id="UNIT_PRICE" />
                        </span>
                        <span className={classes.rightText}>
                            <FormattedMessage
                                id="POPUP_LABEL_SWAP_RATE"
                                values={{
                                    tokenFrom: this.state.token,
                                    tokenTo: this.state.buyToken,
                                    rate: parseFloat(
                                        this.state.token == "SYX"
                                            ? this.state.price
                                            : 1 / this.state.price
                                    ).toFixed(4)
                                }}
                            />
                        </span>
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        autoFocus
                        onClick={this.confirm}
                        className={classes.button}
                        fullWidth={true}
                    >
                        <FormattedMessage id="POPUP_ACTION_CONFIRM" />
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(TransactionModal);
