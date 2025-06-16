export default function Admin() {

    return (

        <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
            <div id="kt_app_toolbar_container" className="app-container container-xxl d-flex flex-stack">
                <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
                    <h1 className="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0"> Admin </h1>
                    <ul className="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1">
                        <li className="breadcrumb-item text-muted">
                            <a href="/admin/manage" className="text-muted text-hover-primary">Home</a>
                        </li>
                        <li className="breadcrumb-item">
                            <span className="bullet bg-gray-400 w-5px h-2px"></span>
                        </li>
                        <li className="breadcrumb-item text-muted">Dashboards</li>
                    </ul>
                </div>
            </div>
        </div>


    );
}