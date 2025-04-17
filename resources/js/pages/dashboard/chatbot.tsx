import ModelComponent from '@/components/3d/model';
import ChatInterface from '@/components/chat/chat-interface';
import DataVisualizer from '@/components/chat/data-visualizer';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

export default function Chatbot() {
    return (
        <AppLayout>
            <Head title="Chatbot" />
            <main className="grid flex-1 grid-cols-1 gap-6 p-4 md:grid-cols-7 md:p-6">
                <div className="animate-slide-up h-[calc(100vh-8rem)]">
                    <ModelComponent />
                </div>

                <div className="animate-slide-up h-[calc(100vh-8rem)] md:col-span-3">
                    <ChatInterface />
                </div>

                <div className="animate-slide-up h-[calc(100vh-8rem)] md:col-span-3" style={{ animationDelay: '0.2s' }}>
                    <DataVisualizer />
                </div>
            </main>
        </AppLayout>
    );
}
