import { View, Text, Image, TouchableOpacity, Linking ,ScrollView} from "react-native";

const doctors = [
  {
    name: "Dr. Vasantha Jayaram",
    specialty: "Psychiatry, Mental Health",
    experience: "43 Years of Experience",
    hospital: "Mental Health Clinic, Thiruvanmiyur",
    image: require("../assets/images/doctor-2.jpg"), // Replace with actual image
    url:"https://www.practo.com/chennai/doctor/dr-vasantha-jayaram-1?practice_id=1171019&specialization=Psychiatrist&referrer=doctor_listing&page_uid=53d75715-54f2-4872-91d2-7c53b811e9cf"
  },
  {
    name:"Dr. D Archanaa",
    specialty:"Psychiatry",
    experience:"12 Years of Experience",
    hospital:"Apollo Hospitals,Chennai",
    image:require("../assets/images/doctor-1.jpg"),
    url:"https://www.apollo247.com/doctors/dr-d-archanaa-77f3cbbe-8eab-4610-9242-d326ba06078b",
  },
  {
    name:"Dr. Subashini",
    specialty:"Psychiatry",
    experience:"20 Years of Experience",
    hospital:"Sculpting Minds",
    image:require("../assets/images/doctor-3.webp"),
    url:"https://www.practo.com/chennai/doctor/subashini-psychiatrist?practice_id=1416811&specialization=Psychiatrist&referrer=doctor_listing&page_uid=53d75715-54f2-4872-91d2-7c53b811e9cf",
  },
  {
    name:"Dr. S.Arunkumar",
    specialty:"Psychiatry",
    experience:"16 Years of Experience",
    hospital:"AGAM Wellness Clinic ",
    image:require("../assets/images/doctor-4.webp"),
    url:"https://www.practo.com/chennai/doctor/dr-arun-kumar-11-psychiatrist?practice_id=709372&specialization=Psychiatrist&referrer=doctor_listing&page_uid=53d75715-54f2-4872-91d2-7c53b811e9cf"
  },
];

const ReferencesScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{padding:20}}>
      {doctors.map((doctor, index) => (
        <View key={index} style={{ marginBottom: 20 }}>
          <Image source={doctor.image} style={{ width: 80, height: 80, borderRadius: 40 }} />
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>{doctor.name}</Text>
          <Text>{doctor.specialty}</Text>
          <Text>{doctor.experience}</Text>
          <Text>{doctor.hospital}</Text>

          <TouchableOpacity
            onPress={() => Linking.openURL(doctor.url)}
            style={{
              backgroundColor: "#6A5ACD",
              padding: 10,
              borderRadius: 10,
              marginTop: 10,
              width:200,
              alignItems:"center",
            }}
          >
            <Text style={{ color: "#fff", textAlign: "center" }}>Book Appointment</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
    </View>
  );
};

export default ReferencesScreen;
