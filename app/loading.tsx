import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="mx-auto flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-green-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
              <div className="relative bg-white rounded-full p-6 shadow-xl">
                <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
          Loading Your Math Adventure
        </h1>
        
        <div className="space-y-4">
          <p className="text-lg text-gray-600">
            Crunching numbers and preparing your personalized learning experience...
          </p>
          
          <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Preparing lessons</span>
                <span className="text-sm text-blue-500">✓</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Calculating XP</span>
                <div className="h-2 w-2 bg-blue-500 rounded-full animate-ping"></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Setting up streak</span>
                <div className="h-2 w-2 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: '0.2s' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Preparing problems</span>
                <div className="h-2 w-2 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center">
            <div className="w-full max-w-xs">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full animate-pulse"
                  style={{ 
                    width: '75%',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                  }}
                ></div>
              </div>
              <p className="mt-2 text-sm text-gray-500">Almost there...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}