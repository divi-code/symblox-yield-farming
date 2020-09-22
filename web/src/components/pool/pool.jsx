import React from "react";
import {FormattedMessage} from "react-intl";
import {makeStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles({
    root: {
        position: "relative",
        borderRadius: "12px",
        textAlign: "center",
        fontStyle: "normal",
        fontWeight: "300",
        fontSize: "20px",
        lineHeight: "28px",
        color: "#ACAEBC",
        boxShadow: "0px 0px 35px 0px rgba(94, 85, 126, 0.15)",
        height: "380px"
    },
    featuredRoot: {
        position: "relative",
        borderRadius: "12px",
        textAlign: "center",
        fontStyle: "normal",
        fontWeight: "300",
        fontSize: "20px",
        lineHeight: "28px",
        color: "#FFFFFF",
        background:
            "linear-gradient(124.56deg, #E71E85 -27.83%, #2148D3 55.48%, #2148D3)",
        mixBlendMode: "normal",
        boxShadow: "0px 0px 35px 0px rgba(94, 85, 126, 0.15)",
        height: "380px",
        "&::after": {
            // content: "''",
            // backgroundImage: "url('/bg_pool.svg')",
            // backgroundSize: "auto",
            // backgroundRepeat: "no-repeat",
            // padding: "100%",
            // pointerEvents: "none"
        }
    },
    icon: {
        width: "48px",
        height: "48px"
    },
    iconSecondary: {
        width: "51px",
        height: "24px",
        marginLeft: "8px"
    },
    title: {
        paddingTop: "17px",
        fontFamily: "Oswald",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "28px",
        lineHeight: "34px",
        opacity: "1 !important",
        color: props =>
            props.data && props.data.featured ? "#FFFFFF" : "#1E304B",
        "& span": {display: "inline-block", verticalAlign: "top"}
    },
    text: {
        fontStyle: "normal",
        fontSize: "20px",
        lineHeight: "20px",
        color: "#ACAEBC",
        opacity: "1 !important"
    },
    featuredText: {
        fontFamily: "Oswald",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "20px",
        lineHeight: "20px",
        color: "white",
        opacity: "1 !important"
    },
    featuredText: {
        fontFamily: "Oswald",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "20px",
        lineHeight: "20px",
        color: "white",
        opacity: "1 !important"
    },
    textSecondary: {
        fontSize: "18px",
        paddingTop: "24px",
        textAlign: "left"
    },
    textThird: {
        fontSize: "18px",
        paddingTop: "8px",
        textAlign: "left"
    },
    textSecondaryColor: {
        color: "#36B685"
    },
    textThirdColor: {
        color: props =>
            props.data && props.data.featured ? "#FFFFFF" : "#1E304B"
    },
    button: {
        background:
            "linear-gradient(135deg, #42D9FE 0%, #2872FA 100%, #42D9FE)",
        borderRadius: "26px",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "20px",
        color: "#FFFFFF",
        margin: "24px",
        minWidth: "213px",
        "&:hover": {
            background:
                "linear-gradient(315deg, #4DB5FF 0%, #57E2FF 100%, #4DB5FF)"
        }
    },
    buttonSecondary: {
        background:
            "linear-gradient(315deg, #FF3A33 0%, #FC06C6 100%, #FF3A33)",
        borderRadius: "26px",
        fontStyle: "normal",
        fontWeight: 500,
        fontSize: "20px",
        color: "#FFFFFF",
        margin: "20px",
        minWidth: "213px",
        "&:hover": {
            background:
                "linear-gradient(315deg, #FF78E1 0%, #FF736E 100%, #FF78E1)"
        }
    },
    bar: {
        textAlign: "center",
        display: "block"
    }
});

export default function Pool(props) {
    const classes = useStyles(props);
    const {data, onDeposit, onJoin} = props;

    const tokenIcon = "/" + data.name + ".png";

    return (
        <Card className={data.featured ? classes.featuredRoot : classes.root}>
            <CardContent>
                {data.stakeAmount > 0.0001 ? (
                    <div className={"hold-right"}>
                        <FormattedMessage id="HOLD" />
                    </div>
                ) : (
                    <></>
                )}
                <div className={classes.title}>
                    {data.type == "seed" ? (
                        <img className={classes.icon} src={tokenIcon} alt="" />
                    ) : (
                        <>
                            <img
                                className={classes.icon}
                                src={tokenIcon}
                                alt=""
                            />
                            <img
                                className={classes.icon}
                                style={{marginLeft: "-2px"}}
                                src={"/SYX.png"}
                                alt=""
                            />
                        </>
                    )}
                    <div style={{padding: "8px 0 8px"}}>{data.id}</div>
                </div>
                <Tooltip
                    title={
                        <React.Fragment>
                            <FormattedMessage id="TOTAL_SUPPLY" />:
                            {data.type == "seed"
                                ? parseFloat(data.totalSupply || 0).toFixed(4)
                                : (
                                      parseFloat(data.totalSupply || 0) *
                                      parseFloat(data.BPTPrice || 0)
                                  ).toFixed(4) + data.name}
                        </React.Fragment>
                    }
                    enterTouchDelay={700}
                >
                    <Typography
                        className={
                            data.featured ? classes.featuredText : classes.text
                        }
                    >
                        <FormattedMessage id="SEE_DETAIL" />
                    </Typography>
                </Tooltip>

                <Typography className={classes.textSecondary}>
                    <FormattedMessage id="TOTAL_STAKING_APR" />:{" "}
                    <span
                        className={classes.textSecondaryColor}
                        style={{float: "right"}}
                    >
                        {data.rewardApr}%
                    </span>
                </Typography>

                <Typography className={classes.textThird}>
                    <FormattedMessage id="WITHDRAWABLE_REWARDS" />:{" "}
                    <span
                        style={{float: "right"}}
                        className={classes.textThirdColor}
                    >
                        {parseFloat(data.rewardsAvailable).toFixed(4)}{" "}
                        {data.rewardsSymbol}
                    </span>
                </Typography>
            </CardContent>
            <CardActions className={classes.bar}>
                {data.entryContractAddress ? (
                    <Button
                        size="small"
                        className={classes.button}
                        onClick={onDeposit}
                    >
                        <FormattedMessage id="LP_DEPOSIT" />
                    </Button>
                ) : (
                    <Button
                        size="small"
                        className={classes.buttonSecondary}
                        onClick={onJoin}
                    >
                        <FormattedMessage id="JOIN" />
                    </Button>
                )}
            </CardActions>
        </Card>
    );
}
