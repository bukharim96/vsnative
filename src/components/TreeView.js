import React, { Component, Fragment } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ScrollView
} from 'react-native'

import Icon from './Icon'

export default class TreeView extends Component<{}> {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    const {
      data,
      collapseAll = false
    } = this.props

    this.setState({
      indentLevel: 0,
      data: this.createTreeMap(data)
    })
  }
  
  createTreeMap(data, indent = 0) {
    const { collapseAll = false } = this.props

    return data.map(
      (node) => {
        node.indentLevel = indent
        
        if (node.children && node.children.length > 0) {
          node.indentLevel = indent
          node.isCollapsed = collapseAll
          node.children = this.createTreeMap(node.children, node.indentLevel + 1)
        }

        return node
      }
    )
  }

  isDir(node) {
    return node.hasOwnProperty('isCollapsed')
  }

  renderNode(node, i, children = null) {
    const nodeKey = "treeNode_" + i
    
    return (
      <View key={nodeKey}>
        <View>
          <TouchableHighlight
            onPress={() => this.handleTreeNodeClick(node, i)}
            style={[styles.treeNode, {paddingLeft: (node.indentLevel * 20) + 10}]}
          >
            <Fragment>
              {
                this.isDir(node)
                  ? node.isCollapsed
                    ? <Icon name="triangle-down" size={16} color="#bbb" />
                    : <Icon name="triangle-right" size={16} color="#bbb" />
                  : <Icon name="file-text" size={16} color="#bbb" />
              }
              <Text children={`${node.name} (${node.indentLevel})`} style={styles.treeNodeText} />
            </Fragment>
          </TouchableHighlight>

          { node.isCollapsed && children && <View style={styles.nodeChildren} children={children} /> }
        </View>
      </View>
    )
  }
  
  getChildNodes(data) {
    return data.map((node, i) => {
      if (this.isDir(node) && node.children && node.children.length > 0) {
        // this.setState((previousState) => {
        //   return {
        //     indentLevel: previousState.indentLevel++
        //   }
        // })

        return this.renderNode(node, i, this.getChildNodes(node.children))
      }

      return this.renderNode(node, i)
    })
  }

  handleTreeNodeClick(node, i) {
    if (this.isDir(node) && node.isCollapsed.constructor === Boolean) { // Folder
      node.isCollapsed = !node.isCollapsed

      this.setState({
        data: this.state.data.map(
          (d, k) => k === i ? node : d
        )
      })

      // @fix do it the react way (make use of previous state)
      // this.setState((previousState) => {
      //   return {
      //       data: previousState.data.map(
      //       (d, k) => k === i ? node : d
      //     )
      //   }
      // })
    } else { // File
      // Open file in editor
    }
  }

  render() {
    return <ScrollView
      // indicatorStyle="black"
      showsVerticalScrollIndicator={false}
      children={this.getChildNodes(this.state.data)}
      style={styles.container}
    />
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  treeNode: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    height: 30,
    paddingHorizontal: 15,
    paddingTop: 4
  },
  treeNodeIcon: {flex: 1, alignSelf: 'flex-start'},
  treeNodeText: {fontSize: 17, flex: 4, color: '#bbb', paddingLeft: 10, paddingBottom: 3}
})