import React from 'react';
import Link from 'next/link';
import styles from '../styles/Hero.module.css';

const Hero = () => {
  return (
    <div className={styles.hero}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          🍳 Smart Kitchen IoT
        </h1>
        <p className={styles.subtitle}>
          Transform Your Food Business with AI-Powered IoT Automation
        </p>
        <p className={styles.description}>
          Remote control of kitchen equipment, real-time monitoring, AI-driven inventory management,
          and seamless integration with delivery platforms.
        </p>
        
        <div className={styles.cta}>
          <Link href="#features">
            <a className={styles.primaryBtn}>Explore Features</a>
          </Link>
          <Link href="/docs">
            <a className={styles.secondaryBtn}>View Documentation</a>
          </Link>
        </div>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <h3>7+</h3>
            <p>Smart Features</p>
          </div>
          <div className={styles.stat}>
            <h3>99.8%</h3>
            <p>Uptime</p>
          </div>
          <div className={styles.stat}>
            <h3>Real-time</h3>
            <p>Monitoring</p>
          </div>
        </div>
      </div>

      <div className={styles.illustration}>
        <div className={styles.device}>
          <div className={styles.screen}>
            <div className={styles.icon}>📱</div>
            <p>Kitchen Control</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
