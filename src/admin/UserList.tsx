import { useEffect, useState } from "react"
import { UseSession } from "../contexts/SessionContext"
import { UseUsers } from "../contexts/UsersContext"
import "./userList.css"
import { UseTheme } from "../contexts/ThemeContext"

interface UserMetadata {
  creationTime: string
  lastSignInTime: string
}

interface User {
  uid: string
  email: string
  displayName: string
  metadata: UserMetadata
  isBanned: boolean
  isAdmin: boolean
  isEnterprise: boolean
}

const PAGE_SIZE = 15;

const UserList = () => {
    const { theme } = UseTheme()
    const { getUsers, users } = UseUsers()
    const { handleBanUser, handleUnbanUser } = UseSession()

    const [page, setPage] = useState(1);

    useEffect(() => {
        getUsers()
    }, [])

    const allUsers     = Array.isArray(users) ? users : [];
    const totalPages   = Math.ceil(allUsers.length / PAGE_SIZE);
    const pageUsers    = allUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const renderRoleBadge = (user: User) => {
        if (user.isAdmin)      return <span className="badge badge-admin">ADMIN</span>
        if (user.isEnterprise) return <span className="badge badge-enterprise">ENTERPRISE</span>
        return <span className="badge badge-user">USER</span>
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric', month: 'short', day: 'numeric',
        })
    }

    return (
        <div className={`user-list-container ${theme}`}>

            {/* ── Tabla desktop ── */}
            <table className="sec-table">
                <thead>
                    <tr>
                        <th>Usuario</th>
                        <th>Rol</th>
                        <th>Creado el</th>
                        <th style={{ textAlign: 'center' }}>Estado</th>
                        <th style={{ textAlign: 'right' }}>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {pageUsers.map((user: User) => (
                        <tr key={user.uid}>
                            <td>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontWeight: 'bold' }}>{user.email}</span>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--sec-text-dim)' }}>
                                        ID: {user.uid.substring(0, 8)}...
                                    </span>
                                </div>
                            </td>
                            <td>{renderRoleBadge(user)}</td>
                            <td>{formatDate(user.metadata.creationTime)}</td>
                            <td style={{ textAlign: 'center' }}>
                                {user.isBanned
                                    ? <span className="status-banned">Baneado</span>
                                    : <span className="status-active">Activo</span>
                                }
                            </td>
                            <td style={{ textAlign: 'right' }}>
                                {user.isBanned ? (
                                    <button onClick={() => handleUnbanUser(user.uid)} className="sec-btn btn-unban">
                                        Desbanear
                                    </button>
                                ) : (
                                    <button disabled={user.isAdmin} onClick={() => handleBanUser(user.email)} className="sec-btn btn-ban">
                                        Banear
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* ── Cards mobile ── */}
            <div className="ul-mobile-list">
                {pageUsers.map((user: User) => (
                    <div key={user.uid} className="ul-mobile-card">
                        <div className="ul-mobile-card-top">
                            <div>
                                <p className="ul-mobile-email">{user.email}</p>
                                <p className="ul-mobile-uid">ID: {user.uid.substring(0, 8)}...</p>
                            </div>
                            {renderRoleBadge(user)}
                        </div>
                        <div className="ul-mobile-meta">
                            <div className="ul-mobile-left">
                                {user.isBanned
                                    ? <span className="status-banned">Baneado</span>
                                    : <span className="status-active">Activo</span>
                                }
                                <span className="ul-mobile-date">{formatDate(user.metadata.creationTime)}</span>
                            </div>
                            {user.isBanned ? (
                                <button onClick={() => handleUnbanUser(user.uid)} className="sec-btn btn-unban">
                                    Desbanear
                                </button>
                            ) : (
                                <button disabled={user.isAdmin} onClick={() => handleBanUser(user.email)} className="sec-btn btn-ban">
                                    Banear
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Paginación ── */}
            {totalPages > 1 && (
                <div className="ul-pagination">
                    <button
                        className="ul-page-btn"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        ← ANTERIOR
                    </button>
                    <span className="ul-page-info">
                        {page} / {totalPages}
                        <span className="ul-page-total"> · {allUsers.length} usuarios</span>
                    </span>
                    <button
                        className="ul-page-btn"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                    >
                        SIGUIENTE →
                    </button>
                </div>
            )}
        </div>
    )
}

export default UserList