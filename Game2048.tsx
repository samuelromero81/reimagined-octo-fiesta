import React, { useEffect, useState } from "react";
const N = 4;
function init() {
  let arr = Array(N*N).fill(0);
  addTile(arr); addTile(arr);
  return arr;
}
function addTile(arr: number[]) {
  let empty = arr.map((v,i)=>v?null:i).filter(i=>i!==null) as number[];
  if (empty.length) arr[empty[Math.floor(Math.random()*empty.length)]] = Math.random()<0.9?2:4;
}
function slide(row: number[]) {
  let arr = row.filter(v=>v);
  for (let i=0;i<arr.length-1;i++)
    if (arr[i] === arr[i+1]) { arr[i]*=2; arr[i+1]=0; }
  return arr.filter(v=>v).concat(Array(N-arr.filter(v=>v).length).fill(0));
}
export default function Game2048() {
  const [board, setBoard] = useState<number[]>(init());
  const [score, setScore] = useState(0);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      let moved = false, b = [...board], sc=score;
      if (["ArrowLeft","ArrowRight","ArrowUp","ArrowDown"].includes(e.key)) {
        for (let i=0;i<N;i++) {
          let row = [];
          for (let j=0;j<N;j++) row.push(
            e.key==="ArrowLeft"||e.key==="ArrowRight"?b[i*N+(e.key==="ArrowLeft"?j:N-1-j)]:b[j*N+i]
          );
          let slid = slide(row);
          for (let j=0;j<N;j++) {
            let idx = e.key==="ArrowLeft"||e.key==="ArrowRight"?i*N+(e.key==="ArrowLeft"?j:N-1-j):j*N+i;
            if (b[idx]!==slid[j]) moved=true;
            sc += slid[j]-(b[idx]||0);
            b[idx]=slid[j];
          }
        }
        if (moved) { addTile(b); setBoard(b); setScore(sc); }
      }
    };
    window.addEventListener("keydown", key);
    return ()=>window.removeEventListener("keydown", key);
  }, [board, score]);
  let over = ![...Array(N*N).keys()].some(i=>!board[i]) &&
    ![0,1,2,3].some(i=>[0,1,2,3].some(j=>{
      let v=board[i*N+j];
      return (j<3&&v===board[i*N+j+1])||(i<3&&v===board[(i+1)*N+j]);
    }));
  return (
    <div style={{margin:40}}>
      <h1>2048 Game</h1>
      <div style={{
        display:"grid",gridTemplateColumns:`repeat(${N},64px)`,gap:6,marginTop:20
      }}>
        {board.map((v,i)=>
          <div key={i} style={{
            width:64,height:64,background:v?"#fca":"#eee",
            display:"flex",justifyContent:"center",alignItems:"center",fontSize:32,fontWeight:"bold"
          }}>{v||""}</div>
        )}
      </div>
      <div>Score: {score}</div>
      {over && <b>Game Over!</b>}
    </div>
  );
}