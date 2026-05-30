import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

export default function Home(): JSX.Element {
  return (
    <Layout title="Urbania Docs" description="Documentación del sistema Urbania">
      <main style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Urbania Docs</h1>
        <p>Bienvenido a la documentación del sistema.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
          <Link className="button button--primary" to="/docs/API/AGENTS_GUIDE">
            Documentación API
          </Link>
          <Link className="button button--secondary" to="/docs/APP/AGENTS_GUIDE">
            Documentación APP
          </Link>
          <Link className="button button--secondary" to="/docs/WEB/AGENTS_GUIDE">
            Documentación WEB
          </Link>
        </div>
      </main>
    </Layout>
  );
}