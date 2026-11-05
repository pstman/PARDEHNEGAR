/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CartographicNode } from '../utils/acousticMath';
import { audioEngine } from '../utils/audioEngine';

interface NodeDetailDrawerProps {
  node: CartographicNode | null;
  onClose: () => void;
  onOpenSynthesizerForNode?: (systemId: string) => void;
}

export const NodeDetailDrawer: React.FC<NodeDetailDrawerProps> = ({
  node,
  onClose,
  onOpenSynthesizerForNode,
}) => {
  if (!node) return null;

  const handleAuditionNode = () => {
    if (node.id.includes('isfahan') || node.id.includes('shiraz') || node.id.includes('rayy')) {
      audioEngine.playMicrotone(2, -50, 'santur', 2.5);
    } else if (node.id.includes('istanbul') || node.id.includes('konya')) {
      audioEngine.playMicrotone(4, -22.6, 'ney', 2.5);
    } else if (node.id.includes('thessaloniki') || node.id.includes('sarajevo')) {
      audioEngine.playMicrotone(2, 0, 'bouzouki', 2.0);
    } else {
      audioEngine.playMicrotone(2, 35, 'tambal', 2.2);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-md w-full bg-[#1F1915]/95 backdrop-blur-md border-2 border-[#D97706]/70 rounded-xl shadow-2xl p-5 text-[#EDE0C8] animate-fade-in text-right font-persian" dir="rtl">
      <div className="flex items-start justify-between border-b border-[#594234]/50 pb-3">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-[#D97706] font-bold">
            ایستگاه پیوستار صوتی · {node.region}
          </span>
          <h3 className="text-xl font-bold text-[#F5EEDB] mt-0.5">
            {node.namePersian}
          </h3>
          <div className="text-xs text-[#C4B59D] font-mono mt-0.5">
            {node.nameLatin}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded-full bg-[#2C221C] hover:bg-[#781D22] text-[#EDE0C8] transition text-sm font-bold"
          aria-label="بستن جزئیات ایستگاه"
        >
          ×
        </button>
      </div>

      <div className="mt-3 space-y-2 text-xs text-[#C4B59D]">
        <div>
          <strong className="text-[#F5EEDB]">مکتب و لحن موسیقایی: </strong>
          {node.musicalTradition}
        </div>

        <div>
          <strong className="text-[#F5EEDB]">سازبندی و ارگانولوژی بومی: </strong>
          <div className="flex flex-wrap gap-1 mt-1">
            {node.instruments.map((inst, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-[#2C221C] text-[#E5A836] rounded border border-[#594234]/40 text-[11px] font-medium"
              >
                {inst}
              </span>
            ))}
          </div>
        </div>

        <div className="text-[11.5px] leading-relaxed pt-1 text-[#EDE0C8]">
          <strong className="text-[#D97706]">جایگاه در پیوستار تاریخی: </strong>
          {node.historicalSignificance}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#594234]/40 flex items-center gap-2">
        <button
          onClick={handleAuditionNode}
          className="flex-1 py-1.5 px-3 bg-[#781D22] hover:bg-[#8B2635] text-[#F5EEDB] rounded text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
        >
          <span>🔊 شنیدن طنین آکوستیک</span>
        </button>
        {onOpenSynthesizerForNode && (
          <button
            onClick={() => {
              const systemId = node.id.includes('isfahan') || node.id.includes('shiraz') || node.id.includes('rayy')
                ? 'dastgah-shur'
                : node.id.includes('istanbul') || node.id.includes('konya')
                ? 'makam-rast'
                : node.id.includes('thessaloniki')
                ? 'byzantine-echos-2'
                : 'romanian-doina-carpathian';
              onOpenSynthesizerForNode(systemId);
            }}
            className="py-1.5 px-3 bg-[#2A6F78] hover:bg-[#1E555C] text-[#F5EEDB] rounded text-xs font-bold transition shadow"
          >
            <span>تنظیم مقام</span>
          </button>
        )}
      </div>
    </div>
  );
};
