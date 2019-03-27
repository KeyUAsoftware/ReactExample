import React, {Component} from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/es/Card/Card';
import CardContent from '@material-ui/core/es/CardContent/CardContent';
import Header from '../components/header';
import MealsOrderName from './../components/meals-order-components/meals-order-name'
import MealsOrderPortion from './../components/meals-order-components/meals-order-portion';
import DuplicatePortion from './../components/meals-order-components/duplicate-order';
import MealsYourOrder from './../components/meals-order-components/meals-your-order';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/es/Button/Button';
import '../scss/meals-order/meals-order.css';
import {bindActionCreators} from "redux";
import {
    getMenuAction,
    checkPortionDishAction,
    duplicatePortionAction,
    addPortionAction,
    checkPortionGravyAction,
    getCombinationsAction,
    deletePortionAction,
    addOrderAction,
    orderInfoAction,
    orderInfoNameAction,
    getOrderAction,
    openPortionAction,
    orderCommentInfoAction
} from "../actions";
import {connect} from "react-redux";
import AddedPortionDialog from '../components/meals-order-components/added-order-dialog'


class MealsOrder extends Component {

    componentWillMount() {
        this.props.onGetCombinations();
        this.props.onGetMenu();
        this.props.onGetOrder();
    }

    render() {

        return (
            <main>
                <Header/>
                <h1 className="main-header">Заказ блюд</h1>
                <Grid container>

                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <MealsOrderName orderDate={this.props.order.orderDate}
                                                orderInfoNameAction={(name) => this.props.onNameInfo(name)}/>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} className="portion">

                        {
                            this.props.order.portions.length ? this.props.order.portions.map(portion => (
                                <List component="nav" key={portion.id}>
                                    <ListItem className="portion__title" button
                                              onClick={() => this.props.onOpenPortion(portion.id, portion.open)}>
                                        <ListItemText className="portion__title__text" primary="Порция"/>
                                        {portion.open ? <ExpandLess/> : <ExpandMore/>}
                                    </ListItem>
                                    <Collapse in={portion.open} timeout="auto" unmountOnExit>
                                        {
                                            this.props.menu.length ? this.props.menu.map(menuItem => (
                                                <Grid item xs={12} key={menuItem.id}>
                                                    <MealsOrderPortion portion={portion} portionId={portion.id}
                                                                       menu={menuItem}
                                                                       checkPortionGravyAction={(portionId, checkState) =>
                                                                           this.props.onPortionGravyChecked(portionId, checkState)}
                                                                       checkPortionDishAction={(propsBox, checkState) =>
                                                                           this.props.onPortionDishChecked(propsBox, checkState)}
                                                    />
                                                </Grid>
                                            )) : <div/>
                                        }
                                        <DuplicatePortion dishes={portion.dishes} portionId={portion.id}
                                                          duplicatePortionAction={(portionId, checkState) => this.props.onPortionDuplicated(portionId, checkState)}/>
                                    </Collapse>
                                </List>
                            )) : <div/>

                        }
                    </Grid>
                    <Grid item xs={12}>
                    </Grid>
                    <Grid item xs={12}>
                        <Button className="addPortionButton" variant="outlined"
                                onClick={() => this.props.onPortionAdded(true)}>
                            Добавить порцию
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <MealsYourOrder order={this.props.order}
                                        deletePortionAction={(portionId) => this.props.onPortionDeleted(portionId)}
                                        orderInfoAction={(order) => this.props.onOrderInfo(order)}
                                        orderCommentInfoAction={(comment, positionId) => this.props.onOrderCommentInfo(comment, positionId)}/>
                    </Grid>
                    <Grid item xs={12}>
                        <AddedPortionDialog history={this.props.history} order={this.props.order}
                                            addOrderAction={(order) => this.props.onAddOrder(order)}/>
                    </Grid>
                </Grid>
            </main>
        );
    }
}

//---------- container Smart ------------------

function mapStateProps(state) {
    return {
        menu: state.menu,
        order: state.order
    }
}

function matchDispatchProps(dispatch) {
    return bindActionCreators({
        onGetCombinations: getCombinationsAction,
        onGetMenu: getMenuAction,
        onGetOrder: getOrderAction,
        onNameInfo: orderInfoNameAction,
        onPortionDishChecked: checkPortionDishAction,
        onPortionGravyChecked: checkPortionGravyAction,
        onPortionDuplicated: duplicatePortionAction,
        onPortionAdded: addPortionAction,
        onOpenPortion: openPortionAction,
        onOrderInfo: orderInfoAction,
        onOrderCommentInfo: orderCommentInfoAction,
        onPortionDeleted: deletePortionAction,
        onAddOrder: addOrderAction
    }, dispatch);

}


export default connect(mapStateProps, matchDispatchProps)(MealsOrder);
