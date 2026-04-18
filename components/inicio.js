import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function Inicio({ estres, setEstres, themeColor, rutinas }) {
  const getSugerencia = () => {
    if (estres === 3) return { act: "Meditación", motiv: "Nivel de estrés alto." };
    if (estres === 1) return { act: "Gimnasio Intenso", motiv: "Energía ideal." };
    return { act: "Estudio Pomodoro", motiv: "Equilibrio perfecto." };
  };

  const sugerencia = getSugerencia();

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <Text style={styles.greeting}>RoutineApp</Text>
        <Text style={styles.subtitle}>¿Cómo te sientes hoy?</Text>
      </View>

      <View style={styles.statusRow}>
        {[{id:1,l:'Calmado'},{id:2,l:'Productivo'},{id:3,l:'Estresado'}].map((n) => (
          <TouchableOpacity 
            key={n.id}
            onPress={() => setEstres(n.id)}
            style={[styles.statusBtn, estres === n.id && { backgroundColor: themeColor, borderColor: themeColor }]}
          >
            <Text style={[styles.statusBtnText, estres === n.id && { color: '#fff' }]}>{n.l}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.smartCard, { backgroundColor: themeColor }]}>
        <Text style={styles.smartAction}>{sugerencia.act}</Text>
        <Text style={styles.smartReason}>{sugerencia.motiv}</Text>
        <TouchableOpacity style={styles.btnStart}>
          <Text style={[styles.btnStartText, { color: themeColor }]}>Empezar ahora</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tu Horario</Text>
        
        {/* Renderizado de rutinas creadas */}
        {rutinas.length === 0 ? (
          <Text style={{color: '#999', fontStyle: 'italic'}}>No hay rutinas para hoy.</Text>
        ) : (
          rutinas.map((item) => (
            <View key={item.id} style={styles.timelineItem}>
              <View style={[styles.dot, { backgroundColor: item.nivelEstres === 3 ? '#F44336' : themeColor }]} />
              <Text style={styles.timeText}>{item.horario} - </Text>
              <View>
                <Text style={styles.activityText}>{item.nombre}</Text>
                <Text style={{fontSize: 10, color: '#999'}}>{item.objetivo}</Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { padding: 20 },
  header: { marginBottom: 15, marginTop: 20 },
  greeting: { fontSize: 28, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#666' },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 },
  statusBtn: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 15, borderWidth: 1, borderColor: '#EEE' },
  statusBtnText: { fontSize: 13, fontWeight: '600' },
  smartCard: { padding: 25, borderRadius: 24 },
  smartAction: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  smartReason: { color: 'rgba(255,255,255,0.9)', fontSize: 14, marginTop: 5 },
  btnStart: { backgroundColor: '#FFF', padding: 12, borderRadius: 15, marginTop: 20, alignItems: 'center' },
  btnStartText: { fontWeight: 'bold' },
  section: { marginTop: 35 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  timelineItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 15, borderRadius: 15, marginBottom: 10, elevation: 1 },
  dot: { width: 12, height: 12, borderRadius: 6, marginRight: 15 },
  timeText: { color: '#888', fontWeight: '700' },
  activityText: { color: '#333', fontSize: 16, fontWeight: '500' },
});