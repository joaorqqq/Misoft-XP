
export const XP_SOUNDS = {
  // Usando os IDs fornecidos pelo usuário com o padrão de redirecionamento do Vocaroo
  STARTUP: 'https://vocaroo.com/media1/vocaroo.php?id=1dL4XZHFtVRa',
  SHUTDOWN: 'https://vocaroo.com/media1/vocaroo.php?id=12sEqD8iz89t',
  ERROR: 'https://vocaroo.com/media1/vocaroo.php?id=19guln4ifrJQ',
  // Sons de sistema padrão como fallback e complementos
  NOTIFY: 'https://raw.githubusercontent.com/redphx/windows-xp/main/public/sounds/notify.mp3',
  CLICK: 'https://raw.githubusercontent.com/redphx/windows-xp/main/public/sounds/click.mp3',
  RECYCLE: 'https://raw.githubusercontent.com/redphx/windows-xp/main/public/sounds/recycle.mp3',
  OPEN: 'https://raw.githubusercontent.com/redphx/windows-xp/main/public/sounds/exclamation.mp3',
  MINIMIZE: 'https://raw.githubusercontent.com/redphx/windows-xp/main/public/sounds/ding.mp3',
  CLOSE: 'https://raw.githubusercontent.com/redphx/windows-xp/main/public/sounds/chord.mp3',
};

const audioCache: Record<string, HTMLAudioElement> = {};
let isUnlocked = false;

/**
 * Desbloqueia o contexto de áudio do navegador. 
 * Navegadores modernos bloqueiam sons automáticos sem uma interação prévia do usuário.
 */
export const unlockAudio = () => {
  if (isUnlocked) return;
  const silent = new Audio();
  silent.src = 'data:audio/wav;base64,UklGRigAAABXQVZFRm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==';
  silent.play().then(() => {
    isUnlocked = true;
    console.log("XP Audio Engine: UNLOCKED");
  }).catch(() => {
    // Falha silenciosa, tentará novamente na próxima reprodução
  });
};

/**
 * Toca um som com lógica de redundância para links instáveis do Vocaroo.
 */
export const playSound = (soundUrl: string, volume: number = 0.5) => {
  try {
    unlockAudio();

    const playAudio = (url: string, isRetry = false) => {
      const audio = new Audio();
      audio.src = url;
      audio.volume = volume;
      
      const playPromise = audio.play();

      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn(`[AudioSystem] Falha ao tocar: ${url}`, error.message);
          
          // Se for Vocaroo e não for um retry, tentamos o servidor alternativo
          if (!isRetry && url.includes('vocaroo')) {
            let altUrl = '';
            if (url.includes('media1')) {
               altUrl = url.replace('media1', 'media');
            } else if (url.includes('vocaroo.php')) {
               // Tenta o link direto de MP3 se o PHP falhar
               const idMatch = url.match(/id=([^&]+)/);
               if (idMatch) altUrl = `https://media1.vocaroo.com/mp3/${idMatch[1]}`;
            }

            if (altUrl) {
              console.log(`[AudioSystem] Tentando servidor alternativo: ${altUrl}`);
              playAudio(altUrl, true);
            }
          }
        });
      }

      // Tratamento específico para o erro de "no supported source"
      audio.onerror = () => {
        if (!isRetry && url.includes('vocaroo')) {
          const idMatch = url.match(/id=([^&]+)/) || url.match(/mp3\/([^?]+)/);
          if (idMatch) {
            const fallbackUrl = `https://media.vocaroo.com/mp3/${idMatch[1]}?t=${Date.now()}`;
            console.log(`[AudioSystem] Erro de fonte. Tentando fallback: ${fallbackUrl}`);
            playAudio(fallbackUrl, true);
          }
        }
      };
    };

    playAudio(soundUrl);

  } catch (e) {
    console.error('Erro crítico no sistema de som:', e);
  }
};
