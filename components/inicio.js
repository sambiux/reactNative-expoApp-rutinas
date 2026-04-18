import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function Inicio({ estres, setEstres, themeColor }) {

    const [estadoAnimo, setEstadoAnimo] = useState([
          { id: 1, label: 'Calmado' },
          { id: 2, label: 'Productivo' },
          { id: 3, label: 'Estresado' }
        ])
  
  const getSugerencia = () => {
    if (estres === 3) return { act: "Meditación o Descanso", icon: "🧘", motiv: "Tu nivel de estrés es alto, prioriza tu salud mental." };
    if (estres === 1) return { act: "Gimnasio Intenso", icon: "💪", motiv: "Estás con energía ideal para darlo todo." };
    return { act: "Estudio Pomodoro", icon: "📚", motiv: "Equilibrio perfecto para avanzar en tus metas." };
  };


  const sugerencia = getSugerencia();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <Text style={styles.greeting}>RoutineApp</Text>
        <Text style={styles.subtitle}>¿Cómo te sientes hoy?</Text>
      </View>

      {/* Selectores de Estado */}
      <View style={styles.statusRow}>
        {estadoAnimo.map((nivel) => (
          <TouchableOpacity 
            key={nivel.id}
            onPress={() => setEstres(nivel.id)}
            style={[styles.statusBtn, estres === nivel.id && { backgroundColor: themeColor, borderColor: themeColor }]}
          >
            <Text style={[styles.statusBtnText, estres === nivel.id && { color: '#fff' }]}>
              {nivel.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tarjeta Inteligente Dinámica */}
      <View style={[styles.smartCard, { backgroundColor: themeColor }]}>
        <Text style={styles.smartAction}>{sugerencia.act}</Text>
        <Text style={styles.smartReason}>{sugerencia.motiv}</Text>
        <TouchableOpacity style={styles.btnStart}>
          <Text style={[styles.btnStartText, { color: themeColor }]}>Empezar ahora</Text>
        </TouchableOpacity>
      </View>

      {/* Próximas Tareas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tu Horario</Text>
        <View style={styles.timelineItem}>
          <View style={[styles.dot, { backgroundColor: themeColor }]} />
          <Text style={styles.timeText}>14:00 - </Text>
          <Text style={styles.activityText}>
            {estres == 1 ? (
                <Text style={styles.timeText}>{sugerencia.act}</Text>
            ): estres == 2 ?(
                <Text style={styles.timeText}>{sugerencia.act}</Text>
            ):(
                <Text style={styles.timeText}>{sugerencia.act}</Text>
            )}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { padding: 20 },
  header: { marginBottom: 15, marginTop: 20 },
  greeting: { fontSize: 28, fontWeight: 'bold', color: '#1A1A1A' },
  subtitle: { fontSize: 16, color: '#666' },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 },
  statusBtn: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 15, borderWidth: 1, borderColor: '#EEE', backgroundColor: '#FFF' },
  statusBtnText: { fontSize: 13, fontWeight: '600', color: '#666' },
  smartCard: { padding: 25, borderRadius: 24, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5 },
  smartTitle: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  smartAction: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginVertical: 10 },
  smartReason: { color: 'rgba(255,255,255,0.9)', fontSize: 14, lineHeight: 20 },
  btnStart: { backgroundColor: '#FFF', padding: 14, borderRadius: 15, marginTop: 20, alignItems: 'center' },
  btnStartText: { fontWeight: 'bold', fontSize: 16 },
  section: { marginTop: 35 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  timelineItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 15, borderRadius: 15, borderWidth: 1, borderColor: '#F0F0F0' },
  dot: { width: 12, height: 12, borderRadius: 6, marginRight: 15 },
  timeText: { color: '#888', fontWeight: '700' },
  activityText: { color: '#333', fontSize: 16, fontWeight: '500' },
});