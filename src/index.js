import React, { useEffect, useState } from 'react';
import {
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  View,
  Text,
  StyleSheet,
  StatusBar
} from 'react-native';

import api from './services/api';

export default function App() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    api.get('/movies').then(response => {
      setMovies(response.data);
    });
  }, []);

  async function handleAddMovie() {
    const response = await api.post('/movies', {
      title: `Filme novo - ${Date.now()}`,
      year: 1994
    });

    const movie = response.data;

    setMovies([...movies, movie]);
  }

  async function handleRemoveMovie(id) {
    const findIndex = movies.findIndex(movie => movie.id === id);

    if (findIndex < 0) return

    await api.delete(`/movies/${id}`);

    movies.splice(findIndex, 1);

    setMovies([...movies]);
  }

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#1f1f1f" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lista de Filmes</Text>

        <TouchableOpacity activeOpacity={0.5} style={styles.headerButton}>
          <Text style={styles.textButtonAdd} onPress={handleAddMovie} >
            Adicionar
        </Text>
        </TouchableOpacity>
      </View>

      <SafeAreaView style={styles.container}>
        <FlatList
          data={movies}
          keyExtractor={movie => movie.id}
          renderItem={({ item: movie }) => (
            <View style={styles.movieContent}>
              <Text style={styles.movieTitle}>{movie.title} - {movie.year}</Text>

              <TouchableOpacity activeOpacity={0.5} style={styles.movieButton}>
                <Text
                  style={styles.textButtonRemove}
                  onPress={() => handleRemoveMovie(movie.id)}
                >
                  Remover
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#033011'
  },
  headerTitle: {
    color: '#ccc',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: '#3269c7',
    borderRadius: 4,
  },
  textButtonAdd: {
    fontWeight: 'bold',
    color: '#fff',
  },
  container: {
    padding: 20,
    backgroundColor: '#1f1f1f',
    flex: 1
  },
  movieContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#636363'
  },
  movieTitle: {
    maxWidth: '70%',
    paddingVertical: 16,
    color: '#ccc',
    fontSize: 20,
    fontWeight: 'bold',
  },
  movieButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#c73232',
    borderRadius: 4,
  },
  textButtonRemove: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 0.5,
  },
});