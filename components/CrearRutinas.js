import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Image } from 'react-native';

export default function CrearRutina({ themeColor, onAgregar }) {
  const [nombre, setNombre] = useState('');
  const [desc, setDesc] = useState('');
  const [objetivo, setObjetivo] = useState('Estudiar');
  const [nivelEstres, setNivelEstres] = useState(1);
  const [horario, setHorario] = useState('08:00');
  const [perrito, setPerrito] = useState(null);

  // API de Perritos
  useEffect(() => {
    if (nivelEstres === 3) {
      fetch('https://api.thedogapi.com/v1/images/search')
        .then(res => res.json())
        .then(data => setPerrito(data[0].url));
    }
  }, [nivelEstres]);

  const handleGuardar = () => {
    if (!nombre) return alert('Ponle un nombre a la rutina');
    onAgregar({ nombre, desc, objetivo, nivelEstres, horario });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Crear Rutina</Text>

      <Text style={styles.label}>📝 Información básica</Text>
      <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
      <TextInput style={[styles.input, {height: 60}]} placeholder="Descripción" multiline value={desc} onChangeText={setDesc} />

      <Text style={styles.label}>Objetivo</Text>
      <View style={styles.row}>
        {['Estudiar', 'Ejercicio', 'Descanso', 'Productividad'].map(o => (
          <TouchableOpacity key={o} onPress={() => setObjetivo(o)} style={[styles.chip, objetivo === o && {backgroundColor: themeColor}]}>
            <Text style={{color: objetivo === o ? '#FFF' : '#666'}}>{o}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>*Horario (HH:MM)</Text>
      <TextInput style={styles.input} placeholder="08:00" value={horario} onChangeText={setHorario} />

      <Text style={styles.label}>*Nivel de Estrés</Text>
      <View style={styles.row}>
        {[1, 2, 3].map(n => (
          <TouchableOpacity key={n} onPress={() => setNivelEstres(n)} style={[styles.stressBtn, nivelEstres === n && {backgroundColor: n === 3 ? '#F44336' : themeColor}]}>
            <Text style={{color: nivelEstres === n ? '#FFF' : '#000'}}>{n === 1 ? 'Bajo' : n === 2 ? 'Medio' : 'Alto'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {nivelEstres === 3 && perrito && (
        <View style={styles.dogContainer}>
          <Text style={styles.dogText}>¡Hey! El estrés está alto. Mira este perrito y relájate un poco.</Text>
          <Image source={{uri: perrito}} style={styles.dogImg} />
        </View>
      )}

      <TouchableOpacity style={[styles.saveBtn, {backgroundColor: themeColor}]} onPress={handleGuardar}>
        <Text style={styles.saveBtnText}>Agregar Rutina</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  label: { fontWeight: 'bold', marginTop: 15, marginBottom: 5 },
  input: { backgroundColor: '#FFF', padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#EEE', marginBottom: 10 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 10 },
  chip: { padding: 10, borderRadius: 20, backgroundColor: '#EEE' },
  stressBtn: { flex: 1, padding: 15, borderRadius: 10, backgroundColor: '#EEE', alignItems: 'center' },
  dogContainer: { marginTop: 20, padding: 15, backgroundColor: '#FFF', borderRadius: 15, alignItems: 'center', borderWidth: 1, borderColor: '#F44336' },
  dogText: { color: '#F44336', fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  dogImg: { width: 200, height: 200, borderRadius: 10 },
  saveBtn: { padding: 18, borderRadius: 15, marginTop: 30, alignItems: 'center', marginBottom: 50 },
  saveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});