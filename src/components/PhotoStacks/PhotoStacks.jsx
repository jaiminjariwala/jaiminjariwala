import { useState, useEffect } from 'react';
import './PhotoStacks.css';

const CLOUD_NAME = "deodbdaxc";

const getCloudinaryUrl = (publicId, width = 1200) => {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${width},q_auto,f_auto/${publicId}`;
};

const PhotoStacks = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const photoSections = [
    {
      title: 'Washington D.C.',
      photos: [
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
        'IMG_0927_ijjsx3',
        'IMG_0969_yxomra',
        'IMG_0983_rat8bq',
        'IMG_1015_gueu52',
        'IMG_1107_reijzd'
      ]
    },
    {
      title: 'Virginia',
      photos: [
        'IMG_0469_wrhfaf',
        'IMG_0471_v6y6in',
        'IMG_1142_lxeaj2',
        'IMG_1391_e34lou',
        'IMG_1396_rzum4p',
        'IMG_1398_xryzkz',
        'IMG_1401_ibxtcp',
        'IMG_1402_qj6hkx',
        'IMG_1403_oa6ghq'
      ]
    },
    {
      title: 'Baltimore',
      photos: [
        'FullSizeR_lamwpt',
        'FullSizeR_kawt6z',
        'FullSizeR_pkuvcu',
        'IMG_0608_sr0ixr',
        'IMG_0576_gytzeo',
        'FullSizeR_yeb66c',
        'FullSizeR_wwzqrj',
        'FullSizeR_fnx6qd',
        'IMG_1219_nzkgwm'
      ]
    }
  ];

  const toggleSection = (index) => {
    setExpandedSection(expandedSection === index ? null : index);
  };

  // Add class to section when expanded
  useEffect(() => {
    const section = document.getElementById('photo-stacks');
    if (expandedSection !== null) {
      section.classList.add('has-expanded');
    } else {
      section.classList.remove('has-expanded');
    }
  }, [expandedSection]);

  return (
    <section className="photo-stacks" id="photo-stacks">
      <div className="accordion-container">
        {photoSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="accordion-section">
            <div 
              className="accordion-header"
            >
              <div 
                className="header-left"
                onClick={() => toggleSection(sectionIndex)}
              >
                <h2 className="location-title">{section.title}</h2>
                <button 
                  className={`expand-btn ${expandedSection === sectionIndex ? 'expanded' : ''}`}
                  aria-label={expandedSection === sectionIndex ? 'Collapse' : 'Expand'}
                >
                </button>
              </div>
            </div>
            
            <div 
              className={`accordion-content ${expandedSection === sectionIndex ? 'expanded' : ''}`}
            >
              <div className="photos-container">
                {section.photos.map((photo, photoIndex) => (
                  <div key={photoIndex} className="photo-item">
                    <img 
                      src={getCloudinaryUrl(photo, 1200)}
                      srcSet={`
                        ${getCloudinaryUrl(photo, 600)} 600w,
                        ${getCloudinaryUrl(photo, 1200)} 1200w,
                        ${getCloudinaryUrl(photo, 1800)} 1800w
                      `}
                      sizes="(max-width: 768px) 80vw, 40vw"
                      loading="lazy"
                      alt={`${section.title} photo ${photoIndex + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PhotoStacks;
