import Link from 'next/link';
import styles from './FolderCard.module.css';

export default function FolderCard({ category, emoji, color, route }) {
  return (
    <Link href={route} className="block w-full">
      <div className={styles.folderContainer}>
        {/* Tab */}
        <div 
          className={`${styles.tab} font-masthead`} 
          style={{ backgroundColor: color }}
        >
          {category}
        </div>
        
        {/* Back Flap */}
        <div 
          className={styles.backFlap} 
          style={{ backgroundColor: color }}
        ></div>
        
        {/* Peek Zone */}
        <div className={styles.peekZone}>
          {emoji}
        </div>
        
        {/* Front Flap */}
        <div 
          className={styles.frontFlap} 
          style={{ backgroundColor: color }}
        >
          <div className={`${styles.folderLabel} font-masthead`}>
            {category}
          </div>
        </div>
      </div>
    </Link>
  );
}
