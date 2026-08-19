export function bindLearningInteractions(){
  const pduButton=document.querySelector<HTMLButtonElement>('.reverse-pdu');
  const pduFlow=document.querySelector<HTMLElement>('.pdu-flow');
  if(pduButton&&pduFlow){
    const initial=pduFlow.innerHTML;
    pduButton.addEventListener('click',()=>{
      const decapsulation=pduButton.getAttribute('aria-pressed')!=='true';
      pduButton.setAttribute('aria-pressed',String(decapsulation));
      pduButton.textContent=decapsulation?'Показать инкапсуляцию':'Показать декапсуляцию';
      if(!decapsulation)pduFlow.innerHTML=initial;
    });
  }

  const controlForm=document.querySelector<HTMLFormElement>('#control-form');
  controlForm?.addEventListener('submit',()=>{
    const mistakes=[...controlForm.querySelectorAll<HTMLFieldSetElement>('fieldset[data-correct]')].flatMap((field,index)=>{
      const correct=Number(field.dataset.correct);
      const selected=field.querySelector<HTMLInputElement>('input:checked');
      const labels=[...field.querySelectorAll<HTMLLabelElement>('label')];
      labels.forEach((label,answerIndex)=>label.classList.toggle('correct-answer',answerIndex===correct));
      if(selected&&Number(selected.value)===correct)return [];
      selected?.closest('label')?.classList.add('wrong-answer');
      const question=field.querySelector('legend')?.textContent||`Вопрос ${index+1}`;
      const chosen=selected?.closest('label')?.textContent?.trim()||'Ответ не выбран';
      const right=labels[correct]?.textContent?.trim()||'';
      return [`<li><b>${question}</b><span>Ваш ответ: ${chosen}</span><span>Правильный ответ: ${right}</span></li>`];
    });
    const result=document.querySelector<HTMLElement>('#control-result');
    if(result)result.insertAdjacentHTML('beforeend',mistakes.length?`<div class="control-errors"><h3>Ошибки (${mistakes.length})</h3><ol>${mistakes.join('')}</ol></div>`:'<div class="control-success">✓ Ошибок нет.</div>');
  });
}
