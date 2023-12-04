import React from 'react';
import styles from'../styles/home.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; 
import { NavLink } from "react-router-dom";

function Home() {
  const features = [
    { title: 'Expense Tracking', description: 'Keep a tab on your expenses and understand your spending patterns to manage your money better.' },
    { title: 'Budget Management', description: 'Define and manage your budgets efficiently to avoid overspending and save effectively.' },
    { title: 'Saving Goals', description: 'Set up saving goals, track progress, and get insights on how to reach them faster.' },
    { title: 'Financial Reports', description: 'Generate comprehensive financial reports to understand and analyze your financial status.' },
  ];
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  const handleLoginClick = () => {
    navigate('/login');
  };
  return (
    <div className={styles.home}>
      <nav className={styles.home__nav}>
        <NavLink to="/help">Help</NavLink>
        <NavLink to="/login">Sign In</NavLink>
      </nav>
      <header className={styles.home__header}>
        <h1>Salus</h1>
        <p className={styles.home__paragraph}>Your personal finance companion</p>
      </header>

      <section className={styles.features}>
        <div className={styles.featureCards}>
          {features.map((feature, idx) => (
            <div key={idx} className={styles.featureCard}>
              <h3 className={styles.featureCardTitle}>{feature.title}</h3>
              <p className={styles.featureCardDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
      {!isLoggedIn && <button className={styles.loginButton} onClick={handleLoginClick}>Get Started</button>}
    </div>
  );
}
export default Home;
  
