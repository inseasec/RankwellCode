import { useEffect, useMemo, useState } from 'react'
import './App.css'

/** Avoid double slashes when building API URLs */
const normalizeApiBase = (url) => (url || '').trim().replace(/\/+$/, '')

/**
 * Same pattern as Admin `AdminDashboard.jsx`: logo is loaded from the Admin backend,
 * where uploaded files live under `uploads/rankwellDemoData/`. Org JSON still comes from User API.
 */
const getLogoUrl = () => {
  const adminBase = normalizeApiBase(
    import.meta.env.VITE_ADMIN_API_URL || import.meta.env.VITE_API_URL
  )
  return `${adminBase}/organization/current/logo?t=${Date.now()}`
}

const toViewModel = (apiOrg) => ({
  id: apiOrg?.id ?? '',
  name: apiOrg?.orgName || '',
  tagline: apiOrg?.orgTagline || '',
  description: apiOrg?.orgAbout || '',
  values: apiOrg?.orgValues || '',
  email: apiOrg?.orgEmail || '',
  phone: apiOrg?.orgPhone || '',
  address: apiOrg?.orgAddress || '',
  website: apiOrg?.orgWebsite || '',
  establishedYear: apiOrg?.orgEstablishedYear || '',
  createdAt: apiOrg?.createdAt || new Date().toISOString(),
  logo: apiOrg?.orgLogo ? getLogoUrl() : ''
})

function InfoRow({ label, value }) {
  return (
    <div className="info-row">
      <p className="label">{label}</p>
      <p className={value ? 'value' : 'value muted'}>{value || 'Not provided'}</p>
    </div>
  )
}

function App() {
  const [organization, setOrganization] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [logoFailed, setLogoFailed] = useState(false)
  const apiBaseUrl = useMemo(() => normalizeApiBase(import.meta.env.VITE_API_URL), [])

  useEffect(() => {
    const loadOrganization = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await fetch(`${apiBaseUrl}/organization/current`)
        if (!response.ok) {
          throw new Error('Request failed')
        }
        const data = await response.json()
        if (!data || !data.id) {
          setLoading(false)
          setError('Organization data not found yet. Please add organization details from Admin side first.')
          return
        }
        setLogoFailed(false)
        setOrganization(toViewModel(data))
        setLoading(false)
      } catch {
        setLoading(false)
        setError('Unable to load organization from User backend. Make sure UserBackend is running and reachable.')
      }
    }

    loadOrganization()
  }, [apiBaseUrl])

  return (
    <main className="container">
      <div className="header-card">
        <h1>User Portal - Organization View</h1>
        <p>Same organization details format as Admin view.</p>
      </div>

      {loading && <div className="card">Loading organization details...</div>}

      {!loading && error && <div className="card warning">{error}</div>}

      {!loading && organization && (
        <>
          <section className="card">
            <div className="hero-row">
              <div className="logo-box">
                {organization.logo && !logoFailed ? (
                  <img
                    src={organization.logo}
                    alt={organization.name}
                    className="logo"
                    onError={() => setLogoFailed(true)}
                  />
                ) : (
                  <span className="logo-fallback">ORG</span>
                )}
              </div>
              <div>
                <h2>{organization.name || 'Organization'}</h2>
                <p className={organization.tagline ? 'tagline' : 'tagline muted'}>
                  {organization.tagline || 'Tagline not provided'}
                </p>
              </div>
            </div>
          </section>

          <section className="card">
            <h3>Description</h3>
            <p className={organization.description ? 'text' : 'text muted'}>
              {organization.description || 'Description not provided'}
            </p>
          </section>

          <section className="card">
            <h3>Contact Information</h3>
            <InfoRow label="Email" value={organization.email} />
            <InfoRow label="Phone" value={organization.phone} />
            <InfoRow label="Address" value={organization.address} />
            <InfoRow label="Website" value={organization.website} />
            <InfoRow label="Established Year" value={organization.establishedYear} />
          </section>

          <section className="card">
            <h3>Values</h3>
            <p className={organization.values ? 'text' : 'text muted'}>
              {organization.values || 'Values not provided'}
            </p>
          </section>

          <section className="card">
            <h3>Organization Meta</h3>
            <p className="meta">Created: {new Date(organization.createdAt).toLocaleString()}</p>
            <p className="meta">ID: {organization.id}</p>
          </section>
        </>
      )}
    </main>
  )
}

export default App
