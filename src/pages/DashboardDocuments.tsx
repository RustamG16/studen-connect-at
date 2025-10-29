import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Download, Trash2, CheckCircle, AlertCircle } from "lucide-react";
import DashboardSidebar from "@/components/DashboardSidebar";
import { toast } from "sonner";

const DashboardDocuments = () => {
  const documents = [
    {
      name: "Student ID",
      type: "Identity",
      uploaded: true,
      date: "Jan 10, 2025",
      size: "2.3 MB",
    },
    {
      name: "Enrollment Certificate",
      type: "Academic",
      uploaded: true,
      date: "Jan 8, 2025",
      size: "1.1 MB",
    },
    {
      name: "Income Statement",
      type: "Financial",
      uploaded: false,
      date: "-",
      size: "-",
    },
    {
      name: "Rental Contract",
      type: "Housing",
      uploaded: true,
      date: "Dec 20, 2024",
      size: "3.5 MB",
    },
    {
      name: "Bank Statement",
      type: "Financial",
      uploaded: false,
      date: "-",
      size: "-",
    },
    {
      name: "Passport Copy",
      type: "Identity",
      uploaded: true,
      date: "Jan 5, 2025",
      size: "4.2 MB",
    },
  ];

  const requiredDocs = [
    { name: "Income Statement", bonus: "Studienbeihilfe", urgent: true },
    { name: "Bank Statement", bonus: "Wohnbeihilfe", urgent: false },
  ];

  const handleUpload = () => {
    toast.success("Document uploaded successfully!");
  };

  const handleDownload = () => {
    toast.success("Downloading document...");
  };

  const handleDelete = () => {
    toast.success("Document deleted");
  };

  return (
    <div className="flex min-h-screen w-full bg-muted/30">
      <DashboardSidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-foreground">My Documents</h1>
            <p className="text-muted-foreground">
              Manage your documents for bonus applications and housing requests
            </p>
          </div>

          {/* Upload Status */}
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <Card className="border-2">
              <CardContent className="p-6">
                <div className="mb-2 text-3xl font-bold text-primary">
                  {documents.filter((d) => d.uploaded).length}
                </div>
                <p className="text-sm text-muted-foreground">Documents Uploaded</p>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="p-6">
                <div className="mb-2 text-3xl font-bold text-yellow-500">
                  {documents.filter((d) => !d.uploaded).length}
                </div>
                <p className="text-sm text-muted-foreground">Pending Upload</p>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="p-6">
                <div className="mb-2 text-3xl font-bold text-foreground">
                  {(documents.filter((d) => d.uploaded).reduce((acc, d) => {
                    const size = parseFloat(d.size);
                    return acc + (isNaN(size) ? 0 : size);
                  }, 0)).toFixed(1)} MB
                </div>
                <p className="text-sm text-muted-foreground">Total Storage Used</p>
              </CardContent>
            </Card>
          </div>

          {/* Required Documents Alert */}
          {requiredDocs.length > 0 && (
            <Card className="mb-8 border-l-4 border-l-yellow-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  Missing Required Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {requiredDocs.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{doc.name}</p>
                      <p className="text-sm text-muted-foreground">Required for: {doc.bonus}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {doc.urgent && <Badge variant="destructive">Urgent</Badge>}
                      <Button size="sm" onClick={handleUpload}>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Upload New Document */}
          <Card className="mb-8 border-2 border-dashed">
            <CardContent className="p-8 text-center">
              <Upload className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Upload New Document
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Drag and drop files here, or click to browse
              </p>
              <Button onClick={handleUpload}>Select Files</Button>
            </CardContent>
          </Card>

          {/* Documents List */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Your Documents</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download All
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {documents.map((doc, index) => (
                <Card
                  key={index}
                  className={`border-2 transition-smooth hover:border-primary ${
                    !doc.uploaded ? "border-dashed" : ""
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                            doc.uploaded ? "bg-primary/10" : "bg-muted"
                          }`}
                        >
                          {doc.uploaded ? (
                            <FileText className="h-6 w-6 text-primary" />
                          ) : (
                            <Upload className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{doc.name}</h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <Badge variant="outline">{doc.type}</Badge>
                            {doc.uploaded && (
                              <>
                                <span>{doc.size}</span>
                                <span>•</span>
                                <span>{doc.date}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {doc.uploaded ? (
                          <>
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <Button variant="ghost" size="icon" onClick={handleDownload}>
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={handleDelete}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Button size="sm" onClick={handleUpload}>
                            <Upload className="mr-2 h-4 w-4" />
                            Upload
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardDocuments;
