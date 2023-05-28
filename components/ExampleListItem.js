import {tw} from '@lib';
import React, {memo} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';

const examples = [
  "I'm a curious and creative individual who loves to explore new ideas and concepts. I enjoy thinking outside the box and finding innovative solutions to problems.",
  'मैं एक जिज्ञासु और क्रिएटिव इंडिविजुअल हूँ जो न्यू आइडियास और कंसेप्ट्स की खोज में मज़ा लेता हूँ। मुझे बॉक्स के बाहर सोचने और प्रॉब्लम्स के नवाचारी सोल्यूशंस ढूंढ़ने में आनंद आता है।',
  'मैं एक जिज्ञासु और रचनात्मक व्यक्ति हूँ जो नई विचारों और अवधारणाओं का पता लगाने में रुचि रखता हूँ। मुझे बॉक्स के बाहर सोचना और समस्याओं के नवाचारी समाधान ढूंढ़ने में आनंद आता है।',
  'As a dedicated learner, I thrive on challenges and actively seek out opportunities for growth. I believe in the power of education to transform lives and am committed to making a positive impact in the world.',
  'मैं वन डेडिकेटेड लर्नर हूँ, मुझे चैलेंजेस पर उभरना और ग्रोथ के ऑपर्चूनिटीज की खोज करने में खुशी मिलती है। मैं एजुकेशन की पॉवर पे विश्वास रखता हूँ और पॉजिटिव इम्पैक्ट बनाने के लिए कमिटेड हूँ।',
  'मैं एक समर्पित छात्र हूँ, मुझे चुनौतियों पर उभरने और विकास के लिए अवसरों की खोज करने में खुशी मिलती है। मैं शिक्षा की शक्ति में विश्वास रखता हूँ और दुनिया में सकारात्मक प्रभाव डालने के लिए प्रतिबद्ध हूँ।',
  'I am a natural leader who enjoys collaborating with others and leading projects to success. I possess strong communication skills and have a knack for motivating and inspiring my peers.',
  'मैं एक नेचुरल लीडर हूँ जो दूसरों के साथ मिलकर प्रोजेक्ट्स की लीडरशिप करने में खुशी महसूस करता हूँ। मेरे पास स्ट्रॉंग कम्युनिकेशन स्किल्स हैं और मैं अपने पीयर्स को मोटीवेट और इंस्पायर करने की क्षमता रखता हूँ।',
  'मैं एक प्राकृतिक नेता हूँ, जो दूसरों के साथ मिलकर परियोजनाओं का नेतृत्व करने में खुशी महसूस करता हूँ। मेरे पास मजबूत संचार कौशल हैं और मैं अपने साथियों को प्रेरित और प्रेरणा देने की क्षमता रखता हूँ।',
  'I have a passion for technology and its potential to reshape the future. I enjoy coding and developing software applications that solve real-world problems. My goal is to contribute to the advancement of technology and make a meaningful difference.',
  'मुझे टेक्नोलॉजी की धारा और नवीनतम ट्रेंड्स में रुचि है। मैं वेब डेवलपमेंट और मोबाइल एप्लिकेशन्स तकनीक को समझने और इसमें अपनी क्षमताओं को बढ़ाने में रुचि रखता हूँ।',
  'मुझे तकनीकी की धारा और इसकी भविष्य को बदलने की क्षमता में गहरी रुचि है। मुझे कोडिंग और सॉफ्टवेयर एप्लिकेशनों के विकसित करने में आनंद आता है जो वास्तविक दुनियावी समस्याओं का हल करते हैं। मेरा लक्ष्य तकनीक के प्रगति में योगदान देना है और एक मायने बदलने का सकारात्मक परिणाम हो।',
  'I am an empathetic and compassionate individual who values diversity and inclusivity. I believe in fostering an inclusive learning environment where everyone feels respected and valued for their unique perspectives.',
  'मैं एक क्रिएटिव सोचने वाला हूँ जो अपनी आदर्शवादी सोच और दृष्टिकोण के लिए पहचाना जाता हूँ। मुझे नए और अद्वितीय आइडियास को अपनाने में खुशी मिलती है और क्रिएटिव प्रक्रिया में खुद को समाहित करता हूँ।',
  'मैं एक सहानुभूति और संप्रेषणशील व्यक्ति हूँ जो विविधता और समावेशिता को मूल्य देता है। मुझे सभी को उनके अद्वितीय दृष्टिकोण के लिए सम्मानित और मूल्य दिया जाने वाले एक समावेशी शिक्षा वातावरण को प्रोत्साहित करने में विश्वास है।',
  'I am an avid reader and a lover of words. Writing is my creative outlet, and I find joy in expressing myself through storytelling and poetry. I am constantly seeking inspiration from various genres and authors.',
  'मैं एक उत्क्रमणकारी पाठक और शब्दों के प्रेमी हूँ। लेखन मेरा रचनात्मक रिलीफ है, और मैं कथानकी और कविता के माध्यम से अपनी भावनाओं को व्यक्त करने में आनंद लेता हूँ। मैं विभिन्न शैलियों और लेखकों से प्रेरणा लेने में सदैव रुचि रखता हूँ।',
  'I am a dedicated athlete who understands the importance of discipline, teamwork, and perseverance. Through sports, I have learned valuable life skills such as time management, goal setting, and resilience.',
  'मैं एक समर्पित खिलाड़ी हूँ जो अनुशासन, टीमवर्क, और सहनशीलता के महत्व को समझता हूँ। खेल के माध्यम से मैंने समय प्रबंधन, लक्ष्य निर्धारण, और सहनशीलता जैसे महत्वपूर्ण जीवन कौशल सीखे हैं।',
  'I am a problem-solver at heart. I enjoy tackling complex challenges and finding logical solutions. I have a strong analytical mindset and excel in subjects like mathematics and science.',
  'मैं एक समस्या सुलझाने वाला हूँ। मुझे जटिल चुनौतियों का सामना करने और तार्किक हल ढूंढ़ने में आनंद आता है। मेरे पास मजबूत विश्लेषणात्मक मनोवृत्ति है और मैं गणित और विज्ञान जैसे विषयों में उत्कृष्टता प्राप्त करता हूँ।',
  'I am a social advocate who believes in creating positive change in society. I am actively involved in community service projects and strive to make a difference in the lives of others.',
  'मैं एक सामाजिक प्रवक्ता हूँ जो समाज में सकारात्मक परिवर्तन बनाने में विश्वास रखता हूँ। मैं सामुदायिक सेवा परियोजनाओं में सक्रिय रहता हूँ और दूसरों के जीवन में बदलाव लाने का प्रयास करता हूँ।',
  'I am a lifelong learner who embraces every opportunity to broaden my horizons. I am open-minded, adaptable, and always eager to acquire new knowledge and skills.',
  'मैं एक जीवनभर सीखने वाला व्यक्ति हूँ जो अपने द्वारा अपने दृष्टिकोण को विस्तारित करने का हर अवसर ध्यान से देखता हूँ। मैं खुले-मन से बदलने के लिए तत्पर हूँ, सामर्थ्य को अद्यतित करने के लिए हमेशा उत्सुक हूँ।',
];

const ExampleListItem = memo(({onPress}) => {
  return (
    <>
      <Text style={tw`text-sm text-gray-600 font-avReg p-1`}>Suggesstions</Text>
      <FlatList
        data={examples}
        renderItem={({index, item}) => (
          <ExampleItem index={index} data={item} onPress={onPress} />
        )}
        style={tw`h-[64] mb-2`}
        nestedScrollEnabled={true}
        keyExtractor={item => item}
        ItemSeparatorComponent={() => <View style={tw`h-2`} />}
        showsVerticalScrollIndicator={false}
      />
    </>
  );
});

export const ExampleItem = memo(({index, data, onPress}) => (
  <TouchableOpacity
    onPress={() => onPress(data)}
    activeOpacity={0.5}
    style={tw`${
      index % 2 ? 'bg-white border border-gray-500' : 'bg-blue-600'
    } p-3 rounded-lg shadow-lg`}>
    <Text
      style={tw`text-sm ${
        index % 2 ? 'text-gray-900' : 'text-white'
      } font-avReg`}>
      {data}
    </Text>
  </TouchableOpacity>
));

export default ExampleListItem;
