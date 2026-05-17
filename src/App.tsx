import { useState, useEffect } from 'react';
import type { DataList, FilteredType } from './types';
import { knocks100Data } from './data';
import './App.css';

export default function App() {
    const [completedIds, setCompletedIds] = useState<number[]>(() => {
        const saved = localStorage.getItem("knocks_progress");
        return saved ? JSON.parse(saved) : [];
    });
    const [currentFilter, setCurrentFilter] = useState<FilteredType>("all");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [gachaResult, setGachaResult] = useState<DataList | null>(null);

    useEffect(() => {
        localStorage.setItem("knocks_progress", JSON.stringify(completedIds));
    }, [completedIds]);

    const getLevelLabel = (level: "easy" | "medium" | "hard") => {
        if (level === "easy") return "初級";
        if (level === "medium") return "中級";
        return "上級";
    }

    const total = knocks100Data.length;
    const completedCount = completedIds.filter((id) =>
        knocks100Data.some((k) => k.id === id))
        .length;
    const percent = total > 0 ? Math.round((completedCount / total) * 100) : 0;


    const toggleComplete = (id: number) => {
        setCompletedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const rollGacha = () => {
        const randomIndex = Math.floor(Math.random() * knocks100Data.length);
        setGachaResult(knocks100Data[randomIndex]);
        setIsModalOpen(true);
    }

    const filteredKnocks =
        currentFilter === "all"
          ? knocks100Data
          : knocks100Data.filter((k) => k.level === currentFilter);

    return (
        <div className="container">
          <header>
            <h1>プログラミングお題百本ノック</h1>
            <p>定番ものからアイデアに困らないための特訓場</p>
          </header>
    
          {/* ダッシュボード */}
          <div className="dashboard">
            <div className="progress-container">
              <div className="progress-text">
                <span>進捗度</span>
                <span>{`${percent}% (${completedCount}/${total})`}</span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${percent}%` }}
                ></div>
              </div>
            </div>
            <button className="btn" onClick={rollGacha}>
              今日のお題をガチャる
            </button>
          </div>
    
          {/* フィルターボタン */}
          <div className="filters">
            {(["all", "easy", "medium", "hard"] as FilteredType[]).map((type) => (
              <button
                key={type}
                className={`filter-btn ${currentFilter === type ? "active" : ""}`}
                onClick={() => setCurrentFilter(type)}
              >
                {type === "all" ? "すべて" : getLevelLabel(type)}
              </button>
            ))}
          </div>
    
          {/* お題一覧 */}
          <div className="knock-list">
            {filteredKnocks.map((knock) => {
              const isCompleted = completedIds.includes(knock.id);
              return (
                <div
                  key={knock.id}
                  className={`knock-card ${isCompleted ? "completed" : ""}`}
                >
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      className="knock-checkbox"
                      checked={isCompleted}
                      onChange={() => toggleComplete(knock.id)}
                    />
                  </div>
                  <div className="knock-content">
                    <div className="knock-header">
                      <span className="knock-title">{knock.title}</span>
                      <span className={`badge ${knock.level}`}>
                        {getLevelLabel(knock.level)}
                      </span>
                    </div>
                    <p className="knock-desc">{knock.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
    
          {/* ガチャ結果モーダル */}
          {isModalOpen && gachaResult && (
            <div className="modal" style={{ display: "flex" }}>
              <div className="modal-content">
                <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                  &times;
                </button>
                <h2 className="gacha-modal-title">本日のおすすめお題</h2>
                <div>
                  <h3 className="gacha-result-title">{gachaResult.title}</h3>
                  <span className={`badge ${gachaResult.level} gacha-badge`}>
                    {getLevelLabel(gachaResult.level)}
                  </span>
                  <p className="gacha-result-desc">{gachaResult.desc}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }