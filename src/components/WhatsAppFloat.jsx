import { MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '2347033417802';
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export default function WhatsAppFloat() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      title="Chat with us on WhatsApp"
      className="fixed bottom-4 right-4 z-40 flex items-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-xl shadow-lg hover:bg-[#20bd5a] transition-colors"
    >
      <MessageCircle size={20} fill="white" stroke="white" />
      <span className="text-sm font-medium">Chat with us</span>
    </a>
  );
}
