import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const { text } = await request.json();

  try {
    // Generate summary
    const summaryResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Eres un asistente de investigación altamente capacitado. Tu tarea es generar resúmenes concisos y precisos de cualquier texto que se te proporcione. Debes identificar las ideas principales, los argumentos clave y la tesis central del texto original. El resumen debe ser objetivo, coherente y fácil de entender para cualquier lector." },
        { role: "user", content: `Quiero que me resumas este texto, sacandome las ideas principales y dando un resumen     lo mas breve y completo posible${text}` }
      ],
    });
    const summary = summaryResponse.choices[0].message.content;

    // Generate flashcards
    const flashcardsResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Eres un asistente de aprendizaje inteligente. Dada una temática o un texto, genera tarjetas didácticas personalizadas que faciliten la comprensión y memorización de los conceptos clave. Adapta el nivel de dificultad y el tipo de preguntas al público objetivo especificado. Puedes incluir imágenes, diagramas o ejemplos para ilustrar los conceptos." },
        { role: "user", content: `Creame las flashcard que te parescan para este resumen ${summary}` }
      ],
    });
    const flashcardsText = flashcardsResponse.choices[0].message.content;
    
    // Parse flashcards text into an array of objects
    const flashcards = flashcardsText.split('\n')
      .filter(line => line.trim() !== '')
      .reduce((acc, line, index, array) => {
        if (index % 2 === 0) {
          acc.push({
            question: line.replace(/^Q: /, ''),
            answer: array[index + 1]?.replace(/^A: /, '') || ''
          });
        }
        return acc;
      }, []);

    return NextResponse.json({ summary, flashcards });
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json({ error: 'Failed to generate summary and flashcards' }, { status: 500 });
  }
}