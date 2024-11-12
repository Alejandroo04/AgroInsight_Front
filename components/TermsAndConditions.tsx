import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text, Button } from 'react-native-paper';

interface TermsAndConditionsProps {
  onAccept: () => void;
  onDecline: () => void;
}

export const TermsAndConditions: React.FC<TermsAndConditionsProps> = ({
  onAccept,
  onDecline,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Text variant="headlineMedium" style={styles.title}>
          Términos y Condiciones de AgroInSight
        </Text>

        <Text variant="bodyLarge" style={styles.section}>
          1. Aceptación de los Términos
        </Text>
        <Text style={styles.content}>
          Al registrarse en AgroInSight, usted acepta estos términos y condiciones en su totalidad. 
          Si no está de acuerdo con alguna parte de estos términos, no podrá registrarse ni utilizar nuestros servicios.
        </Text>

        <Text variant="bodyLarge" style={styles.section}>
          2. Registro y Seguridad
        </Text>
        <Text style={styles.content}>
          • Debe proporcionar información precisa y completa durante el registro.{'\n'}
          • La contraseña debe cumplir con requisitos específicos de seguridad incluyendo caracteres especiales, 
            números y letras.{'\n'}
          • Se implementa autenticación de dos factores para mayor seguridad.{'\n'}
          • Después de 3 intentos fallidos de inicio de sesión, su cuenta será bloqueada temporalmente.{'\n'}
          • Es responsable de mantener la confidencialidad de su cuenta y contraseña.
        </Text>

        <Text variant="bodyLarge" style={styles.section}>
          3. Uso del Servicio
        </Text>
        <Text style={styles.content}>
          • El servicio está diseñado para la gestión agrícola y debe utilizarse únicamente para este fin.{'\n'}
          • No debe utilizar el servicio para actividades ilegales o no autorizadas.{'\n'}
          • Debe respetar los derechos de propiedad intelectual.
        </Text>

        <Text variant="bodyLarge" style={styles.section}>
          4. Privacidad y Datos
        </Text>
        <Text style={styles.content}>
          • Recopilamos y procesamos datos personales según nuestra política de privacidad.{'\n'}
          • Los datos de ubicación de parcelas y fincas se utilizan solo para funcionalidades específicas.{'\n'}
          • Implementamos medidas de seguridad para proteger sus datos.{'\n'}
          • Sus datos se almacenan de forma segura y encriptada.
        </Text>

        <Text variant="bodyLarge" style={styles.section}>
          5. Comunicaciones
        </Text>
        <Text style={styles.content}>
          • Recibirá correos electrónicos de verificación y notificaciones importantes.{'\n'}
          • Podemos enviar comunicaciones relacionadas con el servicio y actualizaciones.
        </Text>

        <Text variant="bodyLarge" style={styles.section}>
          6. Terminación
        </Text>
        <Text style={styles.content}>
          • Podemos suspender o terminar su acceso al servicio por violaciones a estos términos.{'\n'}
          • Puede solicitar la eliminación de su cuenta en cualquier momento.
        </Text>

        <Text variant="bodyLarge" style={styles.section}>
          7. Modificaciones
        </Text>
        <Text style={styles.content}>
          Nos reservamos el derecho de modificar estos términos en cualquier momento. 
          Los cambios entrarán en vigor inmediatamente después de su publicación.
        </Text>
      </ScrollView>

      <View style={styles.buttonContainer}>
       
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  section: {
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  content: {
    marginBottom: 16,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  declineButton: {
    backgroundColor: '#f44336',
  },
});

export default TermsAndConditions;