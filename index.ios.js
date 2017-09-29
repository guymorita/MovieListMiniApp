/**
 * @flow
 */

import React, { Component } from "react";
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  TouchableHighlight
} from "react-native";

import { MoviesApi } from "react-native-ernmovie-api";
import { NavigationApi } from "react-native-ernnavigation-api";

export default class MovieListMiniApp extends Component {
  constructor() {
    super();
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    let topMovies = [];
    MoviesApi.requests()
      .getTopRatedMovies()
      .then(movies => {
        if (movies) {
          this.setState(previousState => {
            return { dataSource: ds.cloneWithRows(movies) };
          });
        }
      })
      .catch(error => {
        topMovies = [
          {
            title: "Titanic",
            releaseYear: 1997,
            ratings: "4.5",
            imageUrl: "http://bit.ly/2hnU8mq",
            description: "Titanic"
          },
          {
            title: "Avatar",
            releaseYear: 2009,
            ratings: "4.0",
            imageUrl: "http://bit.ly/2xAX0Cv",
            description: "Avatar"
          }
        ];

        this.setState(previousState => {
          return { dataSource: ds.cloneWithRows(topMovies) };
        });
      });

    this.state = {
      dataSource: ds.cloneWithRows(topMovies)
    };
  }

  render() {
    return (
      <ListView
        style={styles.container}
        dataSource={this.state.dataSource}
        renderRow={movie => (
          <TouchableHighlight
            onPress={() => this._onPressRow(movie)}
            underlayColor="gray"
          >
            <View style={styles.row} onPress={() => this._onPressRow(movie)}>
              <Image
                style={styles.icon}
                source={{
                  uri: movie.imageUrl ? movie.imageUrl : "http://bit.ly/2yz3AYe"
                }}
              />
              <View style={styles.row2}>
                <Text style={styles.title}>{movie.title}</Text>
                <Text style={styles.subtitle}>{movie.releaseYear}</Text>
              </View>
            </View>
          </TouchableHighlight>
        )}
        renderSeparator={(sectionId, rowId) => (
          <View key={rowId} style={styles.separator} />
        )}
      />
    );
  }

  _onPressRow(movie) {
    movie.isSelect = !movie.isSelect;
    NavigationApi.requests()
      .navigate("MovieDetailsMiniApp", {
        initialPayload: JSON.stringify(movie)
      })
      .catch(() => {
        console.log("Navigation failed.");
      });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    padding: 5,
    backgroundColor: "black"
  },
  row: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 12
  },
  row2: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 12
  },
  listview: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  title: {
    fontSize: 20
  },
  subtitle: {
    paddingTop: 5,
    flex: 1,
    fontSize: 12
  },
  separator: {
    flex: 1,
    height: 0,
    paddingTop: 2,
    paddingBottom: 2
  },
  icon: {
    width: 50,
    height: 70,
    flexShrink: 1,
    alignSelf: "center"
  }
});

AppRegistry.registerComponent("MovieListMiniApp", () => MovieListMiniApp);
