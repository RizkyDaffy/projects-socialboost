
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MissionPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLinked, setIsLinked] = useState(false);

  return (
    <div className="min-h-screen bg-appleGray flex flex-col">
      {/* Top Bar */}
      <header className="bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-10 border-b border-gray-100">
        <button
          onClick={() => navigate('/earn-coins')}
          className="p-2 -ml-2 text-appleDark hover:bg-gray-100 rounded-full transition-colors active:scale-90"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-appleGray/50 rounded-full">
          <img
            src="https://img.icons8.com/fluency/48/stack-of-coins.png"
            alt="Coins"
            className="w-5 h-5 object-contain"
          />
          <span className="font-bold text-appleDark text-lg">0</span>
        </div>

        <div className="w-10 h-10 bg-gray-300 rounded-full border-2 border-white shadow-sm overflow-hidden">
          <img src="https://ui-avatars.com/api/?name=User&background=D1D5DB&color=fff" alt="Profile" />
        </div>
      </header>

      <main className="flex-1 p-5 max-w-lg mx-auto w-full flex flex-col gap-5">
        {!isLinked ? (
          /* NOT LINKED STATE */
          <div className="flex flex-col gap-6 mt-2">
            <div className="bg-white rounded-apple p-8 shadow-sm border border-white text-center">
              <h2 className="text-[19px] font-bold text-appleDark mb-4">Oppss!! akun mu belum di tautkan</h2>
              <p className="text-[13px] text-gray-500 leading-relaxed px-4">
                tautkan akun instagram untuk mendapatkan koin dengan mengikuti dan mengerjakan tugas
              </p>
            </div>

            <button
              onClick={() => setIsLinked(true)}
              className="w-full py-5 bg-primary text-white rounded-[14px] font-bold text-[15px] shadow-lg shadow-primary/20 transition-all hover:bg-[#345BA1] active:scale-[0.98] uppercase tracking-wide"
            >
              TAUTKAN AKUN INSTAGRAM
            </button>
          </div>
        ) : (
          /* MISSION ACTIVE STATE */
          <div className="flex flex-col gap-5 mt-2">
            {/* User Info Card */}
            <div className="bg-white rounded-apple p-6 shadow-sm border border-white">
              <h2 className="text-[18px] font-bold text-appleDark mb-1">@rizky.daffy</h2>
              <p className="text-[13px] text-gray-400">Gunakan akun yang sama di aplikasi instagram</p>
            </div>

            {/* Mission Content Placeholder */}
            <div className="bg-white rounded-apple p-4 shadow-sm border border-white flex flex-col">
              <div className="w-full aspect-square bg-[#EBEDF0] rounded-[18px] mb-6"></div>

              <div className="space-y-4">
                <button className="w-full py-5 bg-primary text-white rounded-[14px] font-bold text-[16px] shadow-lg shadow-primary/20 transition-all hover:bg-[#345BA1] active:scale-[0.98]">
                  Kerjakan misi
                </button>
                <button className="w-full py-5 bg-white text-appleDark border-[1.5px] border-primary/50 rounded-[14px] font-bold text-[16px] transition-all hover:bg-gray-50 active:scale-[0.98]">
                  Melewati misi
                </button>
              </div>
            </div>

            {/* Bottom Reward Info Card */}
            <div className="bg-white rounded-apple p-6 shadow-sm border border-white text-center">
              <p className="text-[14px] text-gray-600 font-medium">
                Anda akan mendapatkan 1 koin untuk misi ini
              </p>
            </div>
          </div>
        )}
      </main>

      <div className="h-10"></div>
    </div>
  );
};

export default MissionPage;
