import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';

export default function HistorialInteligente({ themeColor, rutinasUsuario = [], agregarRutina }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('estadisticas'); // 'estadisticas' | 'sugerencias'

  // Filtros para sugerencias
  const [fObj, setFObj] = useState('Descanso');
  const [fTiempo, setFTiempo] = useState(30);
  const [fEstresMax, setFEstresMax] = useState(2);

  useEffect(() => {
    // Tarea Integrante C: Consumir API y usar sus datos para función original
    fetch('https://my-json-server.typicode.com/sambiux/reactNative-expoApp-rutinas/rutinas')
      .then(res => res.json())
      .then(json => {
        if (json && json.length > 0) {
          setData(json);
        } else {
          // Respaldo de la base de datos local
          setData(require('../db.json').rutinas);
        }
        setLoading(false);
      })
      .catch(error => {
        setData(require('../db.json').rutinas);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color={themeColor} style={{ marginTop: 50 }} />;
  }

  // 1. FUNCIÓN ORIGINAL: Estadísticas reales combinadas (Mi horario)
  const getActividadFrecuente = () => {
    if (rutinasUsuario.length === 0) return 'Ninguna';
    const conteo = {};
    let mayor = ''; let max = 0;
    rutinasUsuario.forEach(r => {
      const nombre = r.nombre || 'Personalizada';
      conteo[nombre] = (conteo[nombre] || 0) + 1;
      if (conteo[nombre] > max) { max = conteo[nombre]; mayor = nombre; }
    });
    return mayor;
  };

  const stats = {
    total: rutinasUsuario.length,
    completadas: rutinasUsuario.filter(r => r.completada).length,
    horasTotales: (rutinasUsuario.reduce((acc, curr) => acc + (Number(curr.duracion) || 30), 0) / 60).toFixed(1),
    topCategoria: getActividadFrecuente()
  };

  // 2. FUNCIÓN ORIGINAL: Filtro Avanzado / Sugerencia Inteligente
  const sugeridas = data.filter(d => d.objetivo === fObj && d.duracion <= fTiempo && d.nivelEstres <= fEstresMax);

  const handleAgregarDesdeAPI = (item) => {
    agregarRutina({
      nombre: item.nombre,
      objetivo: item.desc,
      nivelEstres: item.nivelEstres,
      duracion: item.duracion,
      horario: 'Sugerida'
    });
    Alert.alert('✅ ¡Lista!', `Se añadió la actividad "${item.nombre}" a tu horario.`);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Inteligencia & Datos</Text>

      {/* Tabs Internos */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity style={[styles.toggleBtn, tab === 'estadisticas' && { backgroundColor: themeColor }]} onPress={() => setTab('estadisticas')}>
          <Text style={{ color: tab === 'estadisticas' ? '#FFF' : '#666', fontWeight: 'bold' }}>Estadísticas</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toggleBtn, tab === 'sugerencias' && { backgroundColor: themeColor }]} onPress={() => setTab('sugerencias')}>
          <Text style={{ color: tab === 'sugerencias' ? '#FFF' : '#666', fontWeight: 'bold' }}>Calculadora Ideal</Text>
        </TouchableOpacity>
      </View>

      {tab === 'estadisticas' && (
        <View style={styles.section}>
          <Text style={styles.subtitle}>Mi estado y desempeño ({stats.total} rutinas programadas)</Text>
          <View style={styles.grid}>
            <View style={[styles.card, { borderColor: themeColor, borderWidth: 1 }]}>
              <Text style={[styles.bigNum, { color: themeColor }]}>{stats.completadas}</Text>
              <Text style={styles.cardLabel}>Rutinas hechas</Text>
            </View>
            <View style={[styles.card, { borderColor: themeColor, borderWidth: 1 }]}>
              <Text style={[styles.bigNum, { color: themeColor }]}>{stats.horasTotales}h</Text>
              <Text style={styles.cardLabel}>Tiemp. programado</Text>
            </View>
            <View style={[styles.cardFull, { borderColor: themeColor, borderWidth: 1 }]}>
              <Text style={styles.cardLabel}>Actividad más frecuente de mi horario:</Text>
              <Text style={[styles.bigNum, { fontSize: 20, color: themeColor }]}>🏆 {stats.topCategoria}</Text>
            </View>
          </View>
        </View>
      )}

      {tab === 'sugerencias' && (
        <View style={styles.section}>
          <Text style={styles.subtitle}>Filtro Inteligente de API</Text>
          
          <Text style={styles.label}>1. Objetivo a cumplir</Text>
          <View style={styles.row}>
            {['Estudiar', 'Ejercicio', 'Descanso', 'Productividad'].map(o => (
              <TouchableOpacity key={o} style={[styles.chip, fObj === o && { backgroundColor: themeColor }]} onPress={() => setFObj(o)}>
                <Text style={{ color: fObj === o ? '#FFF' : '#666' }}>{o}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>2. Tiempo Máximo ({fTiempo} min)</Text>
          <View style={styles.row}>
            {[15, 30, 45, 60].map(t => (
              <TouchableOpacity key={t} style={[styles.chip, fTiempo === t && { backgroundColor: themeColor }]} onPress={() => setFTiempo(t)}>
                <Text style={{ color: fTiempo === t ? '#FFF' : '#666' }}>{t}m</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>3. Nivel de Estrés Máximo</Text>
           <View style={styles.row}>
            {[1, 2, 3].map(e => (
              <TouchableOpacity key={e} style={[styles.chip, fEstresMax === e && { backgroundColor: themeColor }]} onPress={() => setFEstresMax(e)}>
                <Text style={{ color: fEstresMax === e ? '#FFF' : '#666' }}>{e === 1 ? 'Bajo' : e === 2 ? 'Medio' : 'Alto'}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.subtitleSub}>Resultados Sugeridos ({sugeridas.length})</Text>
          {sugeridas.length === 0 ? (
            <View style={{ alignItems: 'center', marginTop: 20 }}>
              <Text style={{ fontSize: 40 }}>🔍</Text>
              <Text style={{ color: '#999', fontStyle: 'italic', textAlign: 'center', marginTop: 10 }}>No se encontraron rutinas congruentes con tus requerimientos de tiempo, estrés u objetivo.</Text>
            </View>
          ) : (
            sugeridas.map(item => (
               <View key={item.id} style={styles.itemCard}>
                  <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                    <Text style={{fontWeight: 'bold', fontSize: 16, color: '#333'}}>{item.nombre}</Text>
                    <Text style={{color: themeColor, fontWeight:'bold'}}>{item.duracion} min</Text>
                  </View>
                  <Text style={{color: '#666', marginTop: 5}}>{item.desc}</Text>
                  <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10}}>
                    <View style={[styles.badge, { backgroundColor: item.nivelEstres === 3 ? '#F44336' : '#FF9800' }]}>
                      <Text style={{color:'#FFF', fontSize: 10, fontWeight: 'bold'}}>
                        Estrés soportado: {item.nivelEstres === 1 ? 'Bajo' : item.nivelEstres === 2 ? 'Medio' : 'Alto'}
                      </Text>
                    </View>
                    <TouchableOpacity style={{backgroundColor: themeColor, padding: 5, borderRadius: 5, paddingHorizontal: 10}} onPress={() => handleAgregarDesdeAPI(item)}>
                      <Text style={{color: '#FFF', fontSize: 12, fontWeight: 'bold'}}>➕ Añadir</Text>
                    </TouchableOpacity>
                  </View>
               </View>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, backgroundColor: '#FAFAFA' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  toggleContainer: { flexDirection: 'row', backgroundColor: '#EEE', borderRadius: 10, padding: 5, marginBottom: 20 },
  toggleBtn: { flex: 1, padding: 10, alignItems: 'center', borderRadius: 8 },
  section: { paddingBottom: 40 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#555' },
  subtitleSub: { fontSize: 16, fontWeight: 'bold', marginTop: 25, marginBottom: 10, color: '#555' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: '48%', backgroundColor: '#FFF', padding: 20, borderRadius: 15, alignItems: 'center', marginBottom: 15, elevation: 1 },
  cardFull: { width: '100%', backgroundColor: '#FFF', padding: 20, borderRadius: 15, alignItems: 'center', elevation: 1 },
  bigNum: { fontSize: 32, fontWeight: 'bold' },
  cardLabel: { fontSize: 13, color: '#888', marginTop: 5 },
  label: { fontWeight: 'bold', marginTop: 15, marginBottom: 8, color: '#444' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, backgroundColor: '#E0E0E0' },
  itemCard: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 10, elevation: 1 },
  badge: { alignSelf: 'flex-start', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 5, marginTop: 8 }
});
