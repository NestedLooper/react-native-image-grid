'use strict';

import React, { Component } from 'react';
import ListView from 'deprecated-react-native-listview';
import {
    Dimensions,
    StyleSheet,
    View,
} from 'react-native';

let styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    }
});

class PhotoGrid extends React.Component {

    constructor() {
        super();

        this.state = {
            data: new ListView.DataSource({
                rowHasChanged: (r1, r2) => { r1 !== r2; }
            }),
        }
    }

    buildRows(items, itemsPerRow = 3) {
        return items.reduce((rows, item, idx) => {
            // If a full row is filled create a new row array
            if(idx % itemsPerRow === 0 && idx > 0) rows.push([]);
            rows[rows.length-1].push(item);
            return rows;
        }, [[]]);
    }

    render() {
        let rows = this.buildRows(this.props.data, this.props.itemsPerRow);

        return (
            <ListView
                { ...this.props }
                dataSource = { this.state.data.cloneWithRows(rows) }
                renderRow = { this.renderRow.bind(this) }
                style = {{ flex: 1 }} />
        );
    }

    renderRow(items) {
        // Calculate the width of a single item based on the device width
        // and the desired margins between individual items
        let deviceWidth = Dimensions.get('window').width;
        let itemsPerRow = this.props.itemsPerRow;
        let margin = this.props.itemMargin || 1;

        let totalMargin = margin * (itemsPerRow - 1);
        let itemWidth = Math.floor( (deviceWidth) / itemsPerRow );
        let adjustedMargin = this.props.itemPaddingHorizontal * 2;

        return (
            <View style = {[ styles.row, { marginBottom: adjustedMargin } ]}>
                { items.map(item => this.props.renderItem(item, itemWidth, this.props.itemPaddingHorizontal)) }
                { itemsPerRow - items.length > 0 && <View style={{ width: itemWidth * (itemsPerRow - items.length)}} />}
            </View>
        );
    }

}

export default PhotoGrid;
