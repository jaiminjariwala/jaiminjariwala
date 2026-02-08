import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import './PhotoStacks.css';

const CLOUD_NAME = "deodbdaxc";

const getCloudinaryUrl = (publicId, width = 1200) => {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${width},q_auto,f_auto/${publicId}`;
};

const PhotoStacks = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [currentX, setCurrentX] = useState(0);
  const [draggedPhotoIndex, setDraggedPhotoIndex] = useState(null);
  const scrollContainerRef = useRef(null);
  const gsapTween = useRef(null);
  const velocityRef = useRef([]);

  const allPhotos = [
    'IMG_0078_e7ossg',
    'IMG_0101_nzxq3r',
    'IMG_0102_noykcf',
    'IMG_0104_psmqqp',
    'IMG_0108_b9eoi4',
    'IMG_0109_cmfh3m',
    'IMG_0364_ydrfby',
    'IMG_0439_dq2tzj',
    'IMG_0440_zpxkjf',
    'IMG_0543_iitiuc',
    'IMG_0547_bvcr6g',
    'IMG_0765_pu9nb1',
    'IMG_0779_qh1nrc',
    'IMG_0894_cec1lu',
    'IMG_0901_ubkfyj',
    'IMG_0905_ly5aqw',
    'IMG_0908_ixrt0l',
    'IMG_1015_gueu52',
    'IMG_1107_reijzd',
    'IMG_0469_wrhfaf',
    'IMG_0471_v6y6in',
    'IMG_1142_lxeaj2',
    'IMG_1391_e34lou',
    'IMG_1396_rzum4p',
    'IMG_1398_xryzkz',
    'IMG_1401_ibxtcp',
    'IMG_1402_qj6hkx',
    'IMG_1403_oa6ghq',
    'IMG_1498_b4pzgw',
    'IMG_1512_zzs3lo',
    'IMG_1497_tzsfpu',
    'IMG_1511_hazeln',
    'IMG_1507_jgoyis',
    'samples/people/boy-snow-hoodie',
    'IMG_1494_f1rdit',
    'FullSizeR_kawt6z',
    'IMG_0608_sr0ixr',
    'FullSizeR_yeb66c',
    'FullSizeR_wwzqrj',
    'FullSizeR_fnx6qd',
  ];

  const getPhotoIndexFromPosition = (clientX) => {
    if (!scrollContainerRef.current) return null;
    const photos = scrollContainerRef.current.querySelectorAll('.photo-item');
    for (let i = 0; i < photos.length; i++) {
      const rect = photos[i].getBoundingClientRect();
      if (clientX >= rect.left && clientX <= rect.right) return i;
    }
    return null;
  };

  const handleMouseDown = (e) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setCurrentX(e.clientX);
    velocityRef.current = [];
    setDraggedPhotoIndex(getPhotoIndexFromPosition(e.clientX));
    if (gsapTween.current) gsapTween.current.kill();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !scrollContainerRef.current) return;
    e.preventDefault();
    const deltaX = currentX - e.clientX;
    scrollContainerRef.current.scrollLeft += deltaX;
    velocityRef.current.push({ x: e.clientX, time: Date.now() });
    if (velocityRef.current.length > 5) velocityRef.current.shift();
    setCurrentX(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging || !scrollContainerRef.current) return;
    setIsDragging(false);
    setDraggedPhotoIndex(null);

    if (velocityRef.current.length >= 2) {
      const first = velocityRef.current[0];
      const last = velocityRef.current[velocityRef.current.length - 1];
      const deltaX = last.x - first.x;
      const deltaTime = last.time - first.time;
      if (deltaTime > 0) {
        const velocity = deltaX / deltaTime;
        const momentum = velocity * 300;
        const targetScroll = scrollContainerRef.current.scrollLeft - momentum;
        gsapTween.current = gsap.to(scrollContainerRef.current, {
          scrollLeft: targetScroll,
          duration: 1,
          ease: "power2.out",
        });
      }
    }
  };

  const handleTouchStart = (e) => {
    if (!scrollContainerRef.current) return;
    setIsDragging(true);
    setCurrentX(e.touches[0].clientX);
    velocityRef.current = [];
    setDraggedPhotoIndex(getPhotoIndexFromPosition(e.touches[0].clientX));
    if (gsapTween.current) gsapTween.current.kill();
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !scrollContainerRef.current) return;
    const deltaX = currentX - e.touches[0].clientX;
    scrollContainerRef.current.scrollLeft += deltaX;
    velocityRef.current.push({ x: e.touches[0].clientX, time: Date.now() });
    if (velocityRef.current.length > 5) velocityRef.current.shift();
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isDragging || !scrollContainerRef.current) return;
    setIsDragging(false);
    setDraggedPhotoIndex(null);

    if (velocityRef.current.length >= 2) {
      const first = velocityRef.current[0];
      const last = velocityRef.current[velocityRef.current.length - 1];
      const deltaX = last.x - first.x;
      const deltaTime = last.time - first.time;
      if (deltaTime > 0) {
        const velocity = deltaX / deltaTime;
        const momentum = velocity * 300;
        const targetScroll = scrollContainerRef.current.scrollLeft - momentum;
        gsapTween.current = gsap.to(scrollContainerRef.current, {
          scrollLeft: targetScroll,
          duration: 1,
          ease: "power2.out",
        });
      }
    }
  };

  useEffect(() => {
    return () => {
      if (gsapTween.current) gsapTween.current.kill();
    };
  }, []);

  return (
    <section className="photo-stacks" id="photo-stacks">
      <div
        className="photos-wrapper"
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="photos-container">
          {allPhotos.map((photo, photoIndex) => (
            <div
              key={photoIndex}
              className={`photo-item ${isDragging && draggedPhotoIndex === photoIndex ? 'dragging' : ''}`}
            >
              <img
                src={getCloudinaryUrl(photo, 1200)}
                srcSet={`
                  ${getCloudinaryUrl(photo, 600)} 600w,
                  ${getCloudinaryUrl(photo, 1200)} 1200w,
                  ${getCloudinaryUrl(photo, 1800)} 1800w
                `}
                sizes="(max-width: 768px) 80vw, 40vw"
                loading="lazy"
                alt={`Gallery photo ${photoIndex + 1}`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PhotoStacks;
