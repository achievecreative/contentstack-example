export type Content = {
  uid: string;
  _version: number;
  locale: string;
  _in_progress: boolean;
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  publish_details: {
    time: string;
    user: string;
    environment: string;
    local: string;
  };

  tags: string[];
};

export type Home = Content & {
  title: string;
  page_components: Record<string, any>[];
};
